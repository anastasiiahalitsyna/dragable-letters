const inputText = document.getElementById('inputText');
const submitButton = document.getElementById('submitButton');
const output = document.getElementById('output');

let selectedSpans = new Set();
let isDragging = false;
let selectionBox;
let startX, startY;

submitButton.addEventListener('click', () => {
    const text = inputText.value;
    output.innerHTML = '';

    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.classList.add('draggable');
        span.dataset.index = index;

        span.addEventListener('click', (e) => {
            if (e.ctrlKey) {
                toggleSelect(span);
            } else {
                clearSelection();
                toggleSelect(span);
            }
        });

        output.appendChild(span);
    });
});

output.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('draggable')) {
        isDragging = true;
        selectedSpans.clear();
        startX = e.clientX;
        startY = e.clientY;

        if (!selectionBox) {
            selectionBox = document.createElement('div');
            selectionBox.classList.add('selection-box');
            output.appendChild(selectionBox);
        }
    }
});

output.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        selectionBox.style.left = `${Math.min(startX, e.clientX)}px`;
        selectionBox.style.top = `${Math.min(startY, e.clientY)}px`;
        selectionBox.style.width = `${Math.abs(width)}px`;
        selectionBox.style.height = `${Math.abs(height)}px`;

        const spans = output.querySelectorAll('.draggable');
        spans.forEach(span => {
            const spanRect = span.getBoundingClientRect();
            const isWithin = (
                spanRect.left >= Math.min(startX, e.clientX) &&
                spanRect.right <= Math.max(startX, e.clientX) &&
                spanRect.top >= Math.min(startY, e.clientY) &&
                spanRect.bottom <= Math.max(startY, e.clientY)
            );

            if (isWithin) {
                toggleSelect(span);
            }
        });
    }
});

output.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        selectionBox.remove();
        selectionBox = null;
    }
});

function toggleSelect(span) {
    if (selectedSpans.has(span)) {
        selectedSpans.delete(span);
        span.classList.remove('selected');
    } else {
        selectedSpans.add(span);
        span.classList.add('selected');
    }
}

function clearSelection() {
    selectedSpans.forEach(span => {
        span.classList.remove('selected');
    });
    selectedSpans.clear();
}

document.addEventListener('mousemove', (e) => {
    if (selectedSpans.size > 0) {
        const spans = Array.from(selectedSpans);
        spans.forEach(span => {
            span.style.position = 'absolute';
            span.style.left = `${e.pageX}px`;
            span.style.top = `${e.pageY}px`;
        });
    }
});

document.addEventListener('mouseup', (e) => {
    if (selectedSpans.size > 0) {
        const spans = Array.from(selectedSpans);
        spans.forEach(span => {
            span.style.position = 'static';
            output.appendChild(span);
        });
    }
});