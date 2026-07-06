import test from 'node:test';
import assert from 'node:assert/strict';
import { circleConfig, drawCircle, updateCircleFill, updateCircleRadius } from '../main.js';

class FakeSvgElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName;
    this.ownerDocument = ownerDocument;
    this.attributes = new Map();
    this.children = [];
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  getAttribute(name) {
    return this.attributes.get(name);
  }

  append(child) {
    this.children.push(child);
  }
}

function createFakeStage() {
  const ownerDocument = {
    createElementNS(_namespace, tagName) {
      return new FakeSvgElement(tagName, ownerDocument);
    },
  };

  return new FakeSvgElement('svg', ownerDocument);
}

test('drawCircle appends a configured SVG circle to the stage', () => {
  const stage = createFakeStage();
  const circle = drawCircle(stage, circleConfig);

  assert.equal(stage.children.length, 1);
  assert.equal(stage.children[0], circle);
  assert.equal(circle.tagName, 'circle');
  assert.equal(circle.getAttribute('id'), 'poc-circle');
  assert.equal(circle.getAttribute('cx'), '200');
  assert.equal(circle.getAttribute('cy'), '150');
  assert.equal(circle.getAttribute('r'), '72');
  assert.equal(circle.getAttribute('fill'), '#2563eb');
  assert.equal(circle.getAttribute('stroke'), '#1e3a8a');
  assert.equal(circle.getAttribute('stroke-width'), '6');
});

test('update helpers change circle radius and fill', () => {
  const stage = createFakeStage();
  const circle = drawCircle(stage, circleConfig);

  updateCircleRadius(circle, 96);
  updateCircleFill(circle, '#dc2626');

  assert.equal(circle.getAttribute('r'), '96');
  assert.equal(circle.getAttribute('fill'), '#dc2626');
});
