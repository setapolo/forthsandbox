const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export const circleConfig = {
  cx: 200,
  cy: 150,
  r: 72,
  fill: '#2563eb',
  stroke: '#1e3a8a',
  strokeWidth: 6,
};

export function drawCircle(stage, config = circleConfig) {
  const circle = stage.ownerDocument.createElementNS(SVG_NAMESPACE, 'circle');

  circle.setAttribute('id', 'poc-circle');
  circle.setAttribute('cx', String(config.cx));
  circle.setAttribute('cy', String(config.cy));
  circle.setAttribute('r', String(config.r));
  circle.setAttribute('fill', config.fill);
  circle.setAttribute('stroke', config.stroke);
  circle.setAttribute('stroke-width', String(config.strokeWidth));

  stage.append(circle);
  return circle;
}

export function updateCircleRadius(circle, radius) {
  circle.setAttribute('r', String(radius));
}

export function updateCircleFill(circle, fill) {
  circle.setAttribute('fill', fill);
}

function initializeCirclePoc(documentRef) {
  const stage = documentRef.querySelector('#circle-stage');

  if (!stage) {
    return;
  }

  const circle = drawCircle(stage, circleConfig);
  const radiusControl = documentRef.querySelector('#radius-control');
  const colorControl = documentRef.querySelector('#color-control');

  radiusControl?.addEventListener('input', (event) => {
    updateCircleRadius(circle, event.target.value);
  });

  colorControl?.addEventListener('input', (event) => {
    updateCircleFill(circle, event.target.value);
  });
}

if (typeof document !== 'undefined') {
  initializeCirclePoc(document);
}
