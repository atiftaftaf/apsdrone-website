const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..');
const assets = path.join(root, 'assets/digital-twins');
const expected = {'01':474409, '02':1250000, '03':1250000};
const forbidden = /file:\/\/|\b[A-Z]:[\\/]|COLMAP|codex|latitude|longitude|fullUrl|modelToEnu|DJI_/i;
for (const [id, count] of Object.entries(expected)) {
  const json = fs.readFileSync(path.join(assets, `demo-${id}.json`), 'utf8');
  assert.doesNotMatch(json, forbidden, 'Public manifest contains private source data');
  const data = JSON.parse(json);
  assert.deepEqual(Object.keys(data).sort(), ['bounds','label','model','photos','pointCount','viewDirection']);
  assert.equal(data.label, `Demo ${id}`);
  assert.equal(data.pointCount, count);
  assert.equal(data.photos.length, 12);
  for (const [index, photo] of data.photos.entries()) {
    assert.deepEqual(Object.keys(photo).sort(), ['center','forward','image','label','right']);
    assert.equal(photo.label, `View ${String(index + 1).padStart(2, '0')}`);
    for (const key of ['center','forward','right']) assert.ok(photo[key].length===3 && photo[key].every(Number.isFinite));
    assert.ok(fs.existsSync(path.join(assets, photo.image)));
    const image = fs.readFileSync(path.join(assets, photo.image));
    assert.equal(image.toString('ascii', 0, 4), 'RIFF');
    for (let offset=12; offset+8<=image.length;) {
      const chunk=image.toString('ascii',offset,offset+4), length=image.readUInt32LE(offset+4);
      assert.ok(!['EXIF','XMP ','ICCP'].includes(chunk), 'Photos must not contain embedded metadata');
      offset+=8+length+(length%2);
    }
  }
  const packed = fs.readFileSync(path.join(assets, data.model));
  assert.equal(packed[3], 0, 'Gzip must not include source filenames');
  const binary = zlib.gunzipSync(packed);
  assert.equal(binary.toString('ascii',0,4), 'DTP1');
  assert.equal(binary.readUInt32LE(4), count);
  assert.equal(binary.length, 8+count*15);
  for(let offset=8;offset<8+count*12;offset+=4) assert.ok(Number.isFinite(binary.readFloatLE(offset)));
  assert.ok(fs.statSync(path.join(assets,`demo-${id}-preview.webp`)).size>20000);
}
for(const file of ['viewer.html','viewer.js','viewer.css']) {
  assert.doesNotMatch(fs.readFileSync(path.join(assets,file),'utf8'),forbidden);
}
const page=fs.readFileSync(path.join(root,'construction-digital-twin-dfw/index.html'),'utf8');
assert.match(page,/\$1,999/);
assert.doesNotMatch(page,/<iframe\b/i, 'Interactive downloads must require a user action');
assert.ok(fs.existsSync(path.join(assets,'vendor/LICENSE.txt')));
console.log('Digital twin validation passed: three point clouds, 36 photos, metadata removal, neutral labels, and deferred loading.');
