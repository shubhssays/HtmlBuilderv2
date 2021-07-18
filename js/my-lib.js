"use strict"

class Draggable {

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

    initDraggable(parentElem, elem) {
        this.dragItems = document.querySelectorAll(elem);
        this.dragItemsWrapper = document.querySelector(parentElem);

        document.addEventListener('touchstart', e => {
            if (e.target && e.target.className.toString().includes('draggable')) {
                this.dragStart(e);
            }
        }, {
            passive: false
        });
        document.addEventListener('touchend', e => {
            if (e.target && e.target.className.toString().includes('draggable')) {
                this.dragEnd(e);
            }
        });
        document.addEventListener('touchmove', e => {
            if (e.target && e.target.className.toString().includes('draggable')) {
                this.drag(e);
            }
        }, {
            passive: false
        });

        document.addEventListener('mousedown', e => {
            if (e.target && e.target.className.toString().includes('draggable')) {
                this.dragStart(e);
            }
        }, {
            passive: false
        });

        document.addEventListener('mouseup', e => {
            if (e.target && e.target.className.toString().includes('draggable')) {
                this.dragEnd(e);
            }
        });
        document.addEventListener('mousemove', e => {
            if (e.target && e.target.className.toString().includes('draggable')) {
                this.drag(e);
            }
        });
    }

    dragStart(e) {

        if (e.type == 'mousedown' && e.button !== 0) {
            this.isDraggable == false;
            return false;
        }

        if (e.target.className.includes('draggable')) {
            this.isDraggable = true;
        } else {
            this.isDraggable = false;
        }

        this.target = e.target;
        let targetPosTop = this.target.offsetTop;
        let targetPosLeft = this.target.offsetLeft;
        let targetWidth = this.target.offsetWidth;

        this.mirroredTarget = this.target.cloneNode(true);
        this.mirroredTarget.id = 'mirrored-sortable';
        this.targetIndex = Array.from(this.dragItemsWrapper.children).indexOf(this.target);

        this.dragItemsWrapper.insertBefore(this.mirroredTarget, this.dragItemsWrapper.childNodes[this.targetIndex])
        let cssStyleText = `position: absolute; top: ${targetPosTop}px; left: ${targetPosLeft}px; background : #ddd ; opacity : 0.5; cursor : grab; width : ${targetWidth}px;`
        this.mirroredTarget.style.cssText = cssStyleText;

        if (e.type === "touchstart") {
            this.initialX = e.touches[0].clientX;
            this.initialY = e.touches[0].clientY;
        } else {
            this.initialX = e.clientX;
            this.initialY = e.clientY;
        }
    }

    drag(e) {

        if (!this.isDraggable) {
            return false;
        }
        e.preventDefault();

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
        console.log('============>>>>>>> drag ended')
        console.log('IS DRAGGABLE====>>>>> ', this.isDraggable, ' | ', e.button)

        if (e.type === 'mouseup') {
            if (!this.isDraggable || e.button !== 0) {
                if (this.mirroredTarget) this.dragItemsWrapper.removeChild(mirroredElem);;
                this.isDraggable = false;
                return false;
            }
        }

        this.initialX = this.currentX;
        this.initialY = this.currentY;
        let hoveredElem = this.getHoveredElement(e, this.mirroredTarget);
        let hoveredElemIndex = Array.from(this.dragItemsWrapper.children).indexOf(hoveredElem);

        if (hoveredElem !== this.target) {
            console.log(this.targetIndex, '|', hoveredElemIndex)
            console.log('targetItem: ', this.dragItemsWrapper.children[this.targetIndex])
            console.log('hoveredItem: ', this.dragItemsWrapper.children[hoveredElemIndex])

            if (this.targetIndex < hoveredElemIndex) {
                this.dragItemsWrapper.insertBefore(this.target, this.dragItemsWrapper.children[hoveredElemIndex])
                this.dragItemsWrapper.insertBefore(hoveredElem, this.dragItemsWrapper.children[this.targetIndex])
            } else {
                this.dragItemsWrapper.insertBefore(hoveredElem, this.dragItemsWrapper.children[this.targetIndex])
                this.dragItemsWrapper.insertBefore(this.target, this.dragItemsWrapper.children[hoveredElemIndex])
            }
        }
        this.isDraggable = false;
    }

    setTranslate(xPos, yPos, el) {
        el.style.transform = "translateY(" + yPos + "px)";
    }

    getHoveredElement(e, mirroredElem) {
        this.dragItemsWrapper.removeChild(mirroredElem);
        if (e.type == 'touchend') {
            let changedTouch = e.changedTouches[0];
            return document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
        } else {
            return document.elementFromPoint(e.clientX, e.clientY);
        }
    }
}