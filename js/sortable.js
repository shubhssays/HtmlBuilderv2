"use strict"

class Sortable {

    constructor() {
        this.dragItems;
        this.dragItemsWrapper;
        this.target;
        this.targetElem;
        this.mirroredTarget;
        this.isDraggable = false;
        this.currentX;
        this.currentY;
        this.initialX;
        this.initialY;
        this.xOffset = 0;
        this.yOffset = 0;
    }

    initSortable(parentElem, elem) {
        this.dragItemsWrapper = document.querySelector(parentElem);
        this.dragItems = this.dragItemsWrapper.querySelectorAll(elem);

        document.addEventListener('touchstart', e => {
            if (e.target && e.target.className.toString().includes('sortable')) {
                this.dragStart(e);
            }   
        }, {
            passive: true
        });
        document.addEventListener('touchend', e => {
            this.dragEnd(e);
        });
        document.addEventListener('touchmove', e => {
            this.drag(e);
        }, {
            passive: false
        });

        document.addEventListener('mousedown', e => {
            if (e.target && e.target.className.toString().includes('sortable')) {
                this.dragStart(e);
            }
        }, {
            passive: false
        });

        document.addEventListener('mouseup', e => {
            this.dragEnd(e);
        });
        this.dragItemsWrapper.addEventListener('mousemove', e => {
            this.drag(e);
        });
    }

    dragStart(e) {

        if (e.type === "touchstart") {
            this.initialX = e.touches[0].clientX;
            this.initialY = e.touches[0].clientY;
        } else {
            e.preventDefault()
            this.initialX = e.clientX;
            this.initialY = e.clientY;
        }

        if (e.type == 'mousedown' && e.button !== 0) {
            this.isDraggable == false;
            return false;
        }

        if (e.target.className.includes('sortable')) {
            this.isDraggable = true;

        } else {
            this.isDraggable = false;
        }

        this.target = e.target;
        let targetPosTop = this.target.offsetTop;
        let targetPosLeft = this.target.offsetLeft;
        let targetWidth = this.target.clientWidth;

        this.mirroredTarget = this.target.cloneNode(true);
        this.mirroredTarget.id = 'mirrored-sortable';
        this.targetIndex = Array.from(this.dragItemsWrapper.children).indexOf(this.target);

        this.dragItemsWrapper.insertBefore(this.mirroredTarget, this.dragItemsWrapper.childNodes[this.targetIndex])
        let cssStyleText = `position: absolute; top: ${targetPosTop}px; left: ${targetPosLeft}px; background : #ddd; opacity : 0.5; cursor : grab; width : ${targetWidth}px;`
        this.mirroredTarget.style.cssText += cssStyleText;
    }

    drag(e) {

        if (!this.isDraggable) {
            return false;
        } else {
            e.preventDefault();
        }

        if (e.type === "touchmove") {
            this.currentX = e.touches[0].clientX - this.initialX;
            this.currentY = e.touches[0].clientY - this.initialY;
        } else {
            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;
        }

        this.setTranslate(this.currentX, this.currentY, this.mirroredTarget);
    }

    dragEnd(e) {
        if (!this.isDraggable) {
            return false;
        }

        if (this.mirroredTarget) {
            this.dragItemsWrapper.removeChild(this.mirroredTarget);
        }

        if (e.type === 'mouseup') {
            if (!this.isDraggable || e.button !== 0) {
                this.isDraggable = false;
                return false;
            }
        }

        this.initialX = this.currentX;
        this.initialY = this.currentY;
        let hoveredElem = this.getHoveredElement(e);
        let hoveredElemIndex = Array.from(this.dragItemsWrapper.children).indexOf(hoveredElem);

        if (hoveredElemIndex !== -1 && hoveredElem !== this.target) {
            if (this.targetIndex < hoveredElemIndex) {
                this.dragItemsWrapper.insertBefore(this.target, this.dragItemsWrapper.children[hoveredElemIndex+1])
            } else {
               this.dragItemsWrapper.insertBefore(this.target, this.dragItemsWrapper.children[hoveredElemIndex])
            }
        }
        this.isDraggable = false;
    }

    setTranslate(xPos, yPos, el) {
        el.style.transform = "translateY(" + yPos + "px)";
    }

    getHoveredElement(e) {
        if (e.type == 'touchend') {
            let changedTouch = e.changedTouches[0];
            return document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
        } else {
            return document.elementFromPoint(e.clientX, e.clientY);
        }
    }
}