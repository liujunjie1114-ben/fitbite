import test from 'node:test';
import assert from 'node:assert/strict';
import {centerCrop,normalizePixels,topClasses} from '../vision-core.js';
test('crop preserves aspect ratio and matches Resize256 CenterCrop224',()=>{const c=centerCrop(640,480);assert.deepEqual(c,{x:110,y:30,size:420});});
test('RGB pixels normalize into planar NCHW ImageNet values',()=>{const out=normalizePixels(new Uint8ClampedArray([255,0,0,255,0,255,0,255]));assert.equal(out.length,6);assert.ok(Math.abs(out[0]-(1-.485)/.229)<.00001);assert.ok(Math.abs(out[3]-(1-.456)/.224)<.00001);});
test('softmax is stable for large logits and returns highest candidate first',()=>{const out=topClasses([1000,1001,999],['a','b','c'],3);assert.equal(out[0].label,'b');assert.ok(out.every(x=>Number.isFinite(x.score)));assert.ok(Math.abs(out.reduce((s,x)=>s+x.score,0)-1)<1e-6);});
