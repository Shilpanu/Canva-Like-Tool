let canvas;
let history = [];
let historyIndex = -1;
let currentTool = 'select';
let canvasBg = '#ffffff';
let currentZoom = 100;

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  setupEventListeners();
  updateDimensions();
});

function initCanvas() {
  const canvasEl = document.getElementById('mainCanvas');
  canvas = new fabric.Canvas('mainCanvas', {
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    preserveObjectStacking: true,
    selection: true
  });

  canvas.on('selection:created', handleSelection);
  canvas.on('selection:updated', handleSelection);
  canvas.on('selection:cleared', handleSelectionCleared);
  canvas.on('object:modified', saveHistory);
  canvas.on('object:added', saveHistory);
  canvas.on('object:removed', saveHistory);

  saveHistory();
}

function handleSelection(e) {
  const selected = e.selected[0];
  if (!selected) return;

  const propsPanel = document.getElementById('elementProperties');
  const textPropsPanel = document.getElementById('textProperties');

  if (selected.type === 'i-text' || selected.type === 'text') {
    propsPanel.style.display = 'none';
    textPropsPanel.style.display = 'block';
    updateTextPropertiesUI(selected);
  } else {
    textPropsPanel.style.display = 'none';
    propsPanel.style.display = 'block';
    updateElementPropertiesUI(selected);
  }
}

function handleSelectionCleared() {
  document.getElementById('elementProperties').style.display = 'none';
  document.getElementById('textProperties').style.display = 'none';
}

function updateElementPropertiesUI(obj) {
  document.getElementById('fillColor').value = obj.fill || '#000000';
  document.getElementById('fillColorHex').textContent = obj.fill || '#000000';
  document.getElementById('strokeColor').value = obj.stroke || '#000000';
  document.getElementById('strokeColorHex').textContent = obj.stroke || '#000000';
  document.getElementById('strokeWidth').value = obj.strokeWidth || 0;
  document.getElementById('opacity').value = (obj.opacity || 1) * 100;
}

function updateTextPropertiesUI(obj) {
  document.getElementById('fontFamily').value = obj.fontFamily || 'Inter';
  document.getElementById('fontSize').value = obj.fontSize || 24;
  document.getElementById('textColor').value = obj.fill || '#000000';
  document.getElementById('textColorHex').textContent = obj.fill || '#000000';

  document.getElementById('boldBtn').classList.toggle('active', obj.fontWeight === 'bold');
  document.getElementById('italicBtn').classList.toggle('active', obj.fontStyle === 'italic');
  document.getElementById('underlineBtn').classList.toggle('active', obj.underline || false);

  document.getElementById('alignLeft').classList.toggle('active', obj.textAlign === 'left');
  document.getElementById('alignCenter').classList.toggle('active', obj.textAlign === 'center');
  document.getElementById('alignRight').classList.toggle('active', obj.textAlign === 'right');
}

function setupEventListeners() {
  const fileMenuBtn = document.getElementById('fileMenuBtn');
  const fileDropdown = document.getElementById('fileDropdown');

  fileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileDropdown.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!fileDropdown.contains(e.target) && e.target !== fileMenuBtn) {
      fileDropdown.classList.remove('show');
    }
  });

  const panelTabs = document.querySelectorAll('.panel-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  panelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      panelTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetTab) {
          panel.classList.add('active');
        }
      });
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      deleteSelected();
    }
    if (e.key === 'v' || e.key === 'V') {
      setTool('select');
    }
    if (e.key === 't' || e.key === 'T') {
      setTool('text');
    }
    if (e.key === 'Escape') {
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  });
}

function setTool(tool) {
  currentTool = tool;
  document.querySelectorAll('.sidebar-tool').forEach(t => {
    t.classList.toggle('active', t.dataset.tool === tool);
  });

  if (tool === 'select') {
    canvas.isDrawingMode = false;
    canvas.selection = true;
  }
}

function saveHistory() {
  const state = JSON.stringify(canvas.toJSON());
  if (historyIndex < history.length - 1) {
    history = history.slice(0, historyIndex + 1);
  }
  history.push(state);
  historyIndex++;
  updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
  document.getElementById('undoBtn').disabled = historyIndex <= 0;
  document.getElementById('redoBtn').disabled = historyIndex >= history.length - 1;
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    canvas.loadFromJSON(history[historyIndex], () => {
      canvas.renderAll();
      updateUndoRedoButtons();
    });
  }
}

function redo() {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    canvas.loadFromJSON(history[historyIndex], () => {
      canvas.renderAll();
      updateUndoRedoButtons();
    });
  }
}

function addShape(type) {
  let shape;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  switch(type) {
    case 'rect':
      shape = new fabric.Rect({
        left: centerX - 75,
        top: centerY - 50,
        width: 150,
        height: 100,
        fill: '#00C4CC',
        stroke: '#000000',
        strokeWidth: 0
      });
      break;
    case 'circle':
      shape = new fabric.Circle({
        left: centerX - 60,
        top: centerY - 60,
        radius: 60,
        fill: '#7D2AE8',
        stroke: '#000000',
        strokeWidth: 0
      });
      break;
    case 'triangle':
      shape = new fabric.Triangle({
        left: centerX - 60,
        top: centerY - 60,
        width: 120,
        height: 100,
        fill: '#FF6B35',
        stroke: '#000000',
        strokeWidth: 0
      });
      break;
    case 'line':
      shape = new fabric.Line([centerX - 100, centerY, centerX + 100, centerY], {
        stroke: '#000000',
        strokeWidth: 3
      });
      break;
  }

  if (shape) {
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
  }
}

function addStar() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const star = new fabric.Path('M 25 1 L 31 18 L 49 18 L 35 29 L 40 46 L 25 36 L 10 46 L 15 29 L 1 18 L 19 18 z', {
    left: centerX - 25,
    top: centerY - 25,
    fill: '#FFD700',
    stroke: '#000000',
    strokeWidth: 0,
    scaleX: 2,
    scaleY: 2
  });

  canvas.add(star);
  canvas.setActiveObject(star);
  canvas.renderAll();
}

function addHeart() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const heart = new fabric.Path('M 25 45 C 5 25 5 5 25 5 C 35 5 45 15 45 25 C 45 35 25 55 25 55 C 25 55 5 35 5 25 C 5 15 15 5 25 5', {
    left: centerX - 25,
    top: centerY - 25,
    fill: '#FF6B35',
    stroke: '#000000',
    strokeWidth: 0,
    scaleX: 2,
    scaleY: 2
  });

  canvas.add(heart);
  canvas.setActiveObject(heart);
  canvas.renderAll();
}

function addArrow() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const arrow = new fabric.Path('M 0 20 L 80 20 L 80 0 L 120 30 L 80 60 L 80 40 L 0 40 Z', {
    left: centerX - 60,
    top: centerY - 30,
    fill: '#4CAF50',
    stroke: '#000000',
    strokeWidth: 0
  });

  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.renderAll();
}

function addPolygon(sides) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const polygon = new fabric.Polygon(getPolygonPoints(sides, 50), {
    left: centerX - 50,
    top: centerY - 50,
    fill: '#2196F3',
    stroke: '#000000',
    strokeWidth: 0
  });

  canvas.add(polygon);
  canvas.setActiveObject(polygon);
  canvas.renderAll();
}

function getPolygonPoints(sides, radius) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI / sides) - Math.PI / 2;
    points.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle)
    });
  }
  return points;
}

function addText(text, fontSize, fontWeight) {
  const textObj = new fabric.IText(text, {
    left: canvas.width / 2 - 100,
    top: canvas.height / 2 - fontSize / 2,
    fontFamily: 'Inter',
    fontSize: fontSize,
    fontWeight: fontWeight || 'normal',
    fill: '#000000'
  });

  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  textObj.enterEditing();
  canvas.renderAll();
}

function updateTextProperty(prop, value) {
  const activeObj = canvas.getActiveObject();
  if (activeObj && (activeObj.type === 'i-text' || activeObj.type === 'text')) {
    activeObj.set(prop, value);
    canvas.renderAll();
    saveHistory();
    updateTextPropertiesUI(activeObj);
  }
}

function toggleBold() {
  const activeObj = canvas.getActiveObject();
  if (activeObj && (activeObj.type === 'i-text' || activeObj.type === 'text')) {
    activeObj.set('fontWeight', activeObj.fontWeight === 'bold' ? 'normal' : 'bold');
    canvas.renderAll();
    saveHistory();
    updateTextPropertiesUI(activeObj);
  }
}

function toggleItalic() {
  const activeObj = canvas.getActiveObject();
  if (activeObj && (activeObj.type === 'i-text' || activeObj.type === 'text')) {
    activeObj.set('fontStyle', activeObj.fontStyle === 'italic' ? 'normal' : 'italic');
    canvas.renderAll();
    saveHistory();
    updateTextPropertiesUI(activeObj);
  }
}

function toggleUnderline() {
  const activeObj = canvas.getActiveObject();
  if (activeObj && (activeObj.type === 'i-text' || activeObj.type === 'text')) {
    activeObj.set('underline', !activeObj.underline);
    canvas.renderAll();
    saveHistory();
    updateTextPropertiesUI(activeObj);
  }
}

function updateElementProperty(prop, value) {
  const activeObj = canvas.getActiveObject();
  if (activeObj) {
    if (prop === 'opacity') {
      activeObj.set(prop, value);
    } else if (prop === 'fill' || prop === 'stroke') {
      activeObj.set(prop, value);
      document.getElementById(prop + 'ColorHex').textContent = value;
    } else {
      activeObj.set(prop, value);
    }
    canvas.renderAll();
    saveHistory();
  }
}

function setSelectedColor(color) {
  const activeObj = canvas.getActiveObject();
  if (activeObj) {
    if (activeObj.type === 'i-text' || activeObj.type === 'text') {
      activeObj.set('fill', color);
      updateTextPropertiesUI(activeObj);
    } else {
      activeObj.set('fill', color);
      updateElementPropertiesUI(activeObj);
    }
    canvas.renderAll();
    saveHistory();
  }
}

function deleteSelected() {
  const activeObj = canvas.getActiveObject();
  if (activeObj) {
    canvas.remove(activeObj);
    canvas.renderAll();
  }
}

function bringForward() {
  const activeObj = canvas.getActiveObject();
  if (activeObj) {
    canvas.bringForward(activeObj);
    canvas.renderAll();
    saveHistory();
  }
}

function sendBackward() {
  const activeObj = canvas.getActiveObject();
  if (activeObj) {
    canvas.sendBackwards(activeObj);
    canvas.renderAll();
    saveHistory();
  }
}

function setCanvasBackground(color) {
  if (color.startsWith('linear-gradient')) {
    const canvasEl = document.getElementById('mainCanvas');
    const ctx = canvasEl.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const colors = color.match(/#[a-fA-F0-9]{6}/g);
    if (colors && colors.length >= 2) {
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      canvas.setBackgroundColor(gradient, canvas.renderAll.bind(canvas));
    }
  } else {
    canvas.backgroundColor = color;
    canvas.renderAll();
  }
  document.querySelectorAll('.bg-option').forEach(btn => {
    btn.classList.remove('active');
    const preview = btn.querySelector('.bg-preview');
    if (preview && preview.style.background) {
      btn.classList.add('active');
    }
  });
}

function updateCanvasSize() {
  const width = parseInt(document.getElementById('canvasWidth').value) || 800;
  const height = parseInt(document.getElementById('canvasHeight').value) || 600;
  canvas.setDimensions({ width, height });
  updateDimensions();
}

function updateDimensions() {
  document.getElementById('dimensionsDisplay').textContent = `${canvas.width} × ${canvas.height} px`;
}

function setPresetSize(w, h) {
  document.getElementById('modalWidth').value = w;
  document.getElementById('modalHeight').value = h;
}

function applyCanvasSize() {
  const width = parseInt(document.getElementById('modalWidth').value);
  const height = parseInt(document.getElementById('modalHeight').value);
  canvas.setDimensions({ width, height });
  document.getElementById('canvasWidth').value = width;
  document.getElementById('canvasHeight').value = height;
  updateDimensions();
  document.getElementById('exportSizeModal').style.display = 'none';
}

function setZoom(value) {
  currentZoom = parseInt(value);
  document.getElementById('zoomValue').textContent = currentZoom + '%';
  const scale = currentZoom / 100;
  const canvasWrapper = document.querySelector('.canvas-wrapper');
  canvasWrapper.style.transform = `scale(${scale})`;
  document.getElementById('zoomSlider').value = currentZoom;
}

function zoomIn() {
  if (currentZoom < 200) {
    setZoom(currentZoom + 10);
  }
}

function zoomOut() {
  if (currentZoom > 25) {
    setZoom(currentZoom - 10);
  }
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      fabric.Image.fromURL(event.target.result, function(img) {
        const scale = Math.min(400 / img.width, 300 / img.height);
        img.set({
          left: canvas.width / 2 - (img.width * scale) / 2,
          top: canvas.height / 2 - (img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  }
}

function addImageFromURL(url) {
  fabric.Image.fromURL(url, function(img) {
    const maxWidth = canvas.width * 0.6;
    const maxHeight = canvas.height * 0.6;
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
    img.set({
      left: canvas.width / 2 - (img.width * scale) / 2,
      top: canvas.height / 2 - (img.height * scale) / 2,
      scaleX: scale,
      scaleY: scale
    });
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
  }, { crossOrigin: 'anonymous' });
}

function openImage(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      fabric.Image.fromURL(event.target.result, function(img) {
        const maxWidth = canvas.width * 0.8;
        const maxHeight = canvas.height * 0.8;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        img.set({
          left: canvas.width / 2 - (img.width * scale) / 2,
          top: canvas.height / 2 - (img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  }
}

function exportDesign() {
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 2
  });

  const link = document.createElement('a');
  link.download = document.getElementById('designName').value + '.png';
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function saveDesign() {
  const json = JSON.stringify(canvas.toJSON());
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = document.getElementById('designName').value + '.json';
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function createNewDesign() {
  if (canvas.getObjects().length > 0) {
    if (!confirm('Create a new design? Unsaved changes will be lost.')) {
      return;
    }
  }
  canvas.clear();
  canvas.backgroundColor = '#ffffff';
  canvas.renderAll();
  document.getElementById('designName').value = 'Untitled Design';
  document.getElementById('canvasWidth').value = 800;
  document.getElementById('canvasHeight').value = 600;
  updateDimensions();
  history = [];
  historyIndex = -1;
  saveHistory();
}

function updateDesignName() {
  document.title = document.getElementById('designName').value + ' - Canva';
}

function showShareModal() {
  document.getElementById('shareModal').style.display = 'flex';
}

function copyLink() {
  alert('Link copied to clipboard!');
  document.getElementById('shareModal').style.display = 'none';
}

function showMoreOptions() {
  alert('More options coming soon!');
}

function presentMode() {
  const wrapper = document.querySelector('.canvas-wrapper');
  wrapper.style.transform = 'scale(1.5)';
  setTimeout(() => {
    wrapper.style.transform = `scale(${currentZoom / 100})`;
  }, 3000);
}

function prevPage() {
  alert('Only one page available in this version');
}

function nextPage() {
  alert('Only one page available in this version');
}