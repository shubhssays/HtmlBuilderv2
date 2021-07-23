jQuery(function () {

    let sortable = new Sortable();
    sortable.initSortable('#se-blog-content', '.se-elem')

    let isLeftSidebarShowing = true;

    $('#left-sidebar-toggler').on('click', function () {
        if (isLeftSidebarShowing) {
            $('#se-left-sidebar').css({
                'transform': 'translateX(-350px)'
            })

            $('#se-main-blog').css({
                'width': '100%'
            })

            $(this).html(`<i class="fas fa-angle-double-right"></i>`)
            isLeftSidebarShowing = false;

        } else {
            $('#se-left-sidebar').css({
                'transform': 'translateX(0)'
            })

            $('#se-main-blog').css({
                'width': 'calc(100% - 350px)'
            })
            $(this).html(`<i class="fas fa-angle-double-left"></i>`)
            isLeftSidebarShowing = true;
        }
    })

    let isSeEditor = true;

    if (isSeEditor) {

        let seElemsIndex = {
            elemWrapper: 0,
            p: 0,
            img: 0,
            h1: 0,
            h2: 0,
            h3: 0,
            h4: 0,
            h5: 0,
            h6: 0,
            hr: 0,
            a: 0,
            code: 0,
            iframe: 0
        }

        let activeSeElem = null;
        let activeElemType = '';
        let seBlogContent = $('#se-blog-content');
        let seEditorTextarea = $('#se-editor-textarea');
        let seEditorImg = $('#se-editor-img');
        let link = $('#link');
        let addSeElemWrapper = $('.add-se-elem-wrapper');
        let updateSeContent = $('#update-se-editor-textarea');

        //css styling

        //width
        let inputWidth = $('#input-width');
        let inputWidthType = $('#input-width-type');
        //height
        let inputHeight = $('#input-height');
        let inputHeightType = $('#input-height-type');
        //font
        let inputFontSize = $('#input-font-size');
        let fontSizeRange = $('#font-size-range');
        let inputTextAlign = $('#input-text-align');
        let inputFontWeight = $('#input-font-weight');
        let inputFontStyle = $('#input-font-style');
        let inputBgColor = $('#bg-color');
        let inputFontColor = $('#font-color');
        //margin
        let elemMarginItem = $('#elem-margin .item');
        let inputMarginTop = $('#margin-top');
        let inputMarginRight = $('#margin-right');
        let inputMarginBottom = $('#margin-bottom');
        let inputMarginLeft = $('#margin-left');
        //padding
        let elemPaddingItem = $('#elem-padding .item');
        let inputPaddingTop = $('#padding-top');
        let inputPaddingRight = $('#padding-right');
        let inputPaddingBottom = $('#padding-bottom');
        let inputPaddingLeft = $('#padding-left');
        //border
        let elemBorderItem = $('#elem-border .item');
        let elemBorderItemSelect = $('#elem-border .item-select');
        let borderTop = $('#border-top');
        let borderRight = $('#border-right');
        let borderBottom = $('#border-bottom');
        let borderLeft = $('#border-left');
        let inputBorderSize = $('#border-size');
        let inputBorderColor = $('#border-color');
        //border radius
        let elemBorderRadiusItem = $('#elem-border-radius .item');
        let inputRadiusTop = $('#radius-top');
        let inputRadiusRight = $('#radius-right');
        let inputRadiusBottom = $('#radius-bottom');
        let inputRadiusLeft = $('#radius-left');
        //box shadow
        let elemShadowItem = $('#elem-box-shadow .item');
        let shadowX = $('#shadow-x');
        let shadowY = $('#shadow-y');
        let shadowBlur = $('#shadow-blur');
        let shadowSpread = $('#shadow-spread');
        let shadowColor = $('#shadow-color');
        //code highlighter
        let inputCodeType = $('#input-code-language');

        //Disable editor 
        $('#se-editor *').attr('disabled', true)

        //ADD ELEMENT
        $(document).on('click', '#dynamic-elems .item-elem', function (e) {
            let $this = $(this);
            let elemTag = $this.attr('data-tag');
            let isEditable = $this.attr('data-editable');

            addElement(elemTag, elemTag, isEditable);
        })

        function addElement(elemTag, elemIdPrefix, isEditable) {
            let elemStr;
            if (isEditable == 'true') {
                elemStr = `<${elemTag} id="${elemIdPrefix}-${seElemsIndex[elemIdPrefix]}" class="se-elem elem-${elemIdPrefix} sortable"><textarea>Type your own content here!</textarea></${elemTag}>`;
            } else {
                if (elemTag == 'img') {
                    elemStr = `<div id="${elemIdPrefix}-${seElemsIndex[elemIdPrefix]}" class="se-elem elem-${elemIdPrefix} sortable"/>
                    <img src="/img/image.png" height="300px" width="300px"/></div> 
                    </div>`;
                    let input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/png, image/gif, image/jpeg');
                    input.setAttribute("id", "_inp");
                    input.style.display = 'none'
                    document.body.appendChild(input)
                    $('#_inp').trigger('click');
                    $('#_inp').change(function () {
                        (async function () {
                            const file = document.querySelector('#_inp').files[0];
                            console.log("_inp src ==> ", file)
                            let blob = await getBase64(file)
                            $('#_inp').remove();
                            $('img[src="/img/image.png"]').attr('src', blob);
                        })()
                    })
                    
                    

                } else if (elemTag == 'code') {
                    elemStr = `<div id="${elemIdPrefix}-${seElemsIndex[elemIdPrefix]}" class="se-elem elem-${elemIdPrefix} sortable line-numbers"><script type="text/plain" class="language-markup"><p>Example</p></script></div>`;
                } else if (elemTag == 'iframe') {
                    elemStr = `<div id="${elemIdPrefix}-${seElemsIndex[elemIdPrefix]}" class="se-elem elem-${elemIdPrefix} sortable line-numbers"><iframe width="100%" height="100%" src="https://www.youtube.com/watch?v=THKkd1AVf70" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
                } else {
                    elemStr = `<${elemTag} id="${elemIdPrefix}-${seElemsIndex[elemIdPrefix]}" class="se-elem elem-${elemIdPrefix} sortable"></${elemTag}>`;
                }
            }

            seBlogContent.append(elemStr).append(function () {
                $(document).find(`#${elemIdPrefix}-${seElemsIndex[elemIdPrefix]} textarea`).trigger('focus');
                if (elemTag == 'code') {
                    Prism.highlightElement($(`#code-${seElemsIndex[elemIdPrefix]} script`)[0]);
                }
                seElemsIndex[elemIdPrefix] += 1;
                $(document).find('.se-elem textarea:last-child').on('blur', function () {
                    let thisElem = $(this);
                    let textContent = thisElem.val();
                    thisElem.parent().html(textContent);
                    thisElem.remove();
                });
            });
        }

        //EDITOR JS
        $(document).on('click', '.se-elem', function () {
            activeElemType = this.id.split('-')[0].trim();
            let seElems = $('.se-elem');
            let thisElem = $(this);
            activeSeElem = thisElem;
            seElems.removeClass('active');
            seElems.find('.remove-elem').remove();
            thisElem.addClass('active').append(`<i class="fas fa-trash-alt remove-elem"></i>`);
            $('#se-editor *').attr('disabled', false);
            setSeEditorStyle(thisElem, activeElemType);
        })

        $(document).on('click', '.remove-elem', function () {
            $(this).parent().remove();
        })

        seEditorTextarea.on('input', function () {
            if (activeElemType == 'code') {
                activeSeElem.html(`<script type="text/plain" class="${inputCodeType.val()}">${seEditorTextarea.val()}</script>`);
                Prism.highlightElement(activeSeElem.find('script')[0]);
                //activeSeElem.html(seEditorTextarea.val());
                //Prism.highlightElement($(`#code-${seElemsIndex[elemIdPrefix]} script`)[0]);
            } else {
                activeSeElem.html(seEditorTextarea.val());
            }
        })

        //link
        link.on('input', function () {
            let linkVal = $(this).val();
            console.log('Link value: ', linkVal)
            if (activeElemType == 'iframe') {
                activeSeElem.find('iframe').attr('src', linkVal)
            } else {
                if (linkVal.length > 0) {
                    if (activeSeElem.find('a').length == 0) {
                        activeSeElem.wrapInner(`<a class="text-reset" href="${linkVal}" target="_blank"></a>`);
                    } else {
                        activeSeElem.find('a').attr('href', linkVal)
                    }
                } else {
                    activeSeElem.find('a').contents().unwrap();
                }
            }
        })


        //Width
        inputWidth.on('input', function () {
            if (activeElemType == 'img') {
                activeSeElem.find('img').css('width', `${inputWidth.val() ? inputWidth.val() + inputWidthType.val() : 'unset'}`);
            } else {
                activeSeElem.css('width', `${inputWidth.val() ? inputWidth.val() + inputWidthType.val() : 'unset'}`);
            }
        })
        inputWidthType.on('change', function () {
            if (activeElemType == 'img') {
                activeSeElem.find('img').css('width', `${inputWidth.val() + inputWidthType.val()}`);
            } else {
                activeSeElem.css('width', `${inputWidth.val() + inputWidthType.val()}`);
            }
        })

        //Height
        inputHeight.on('input', function () {
            if (activeElemType == 'img') {
                activeSeElem.find('img').css('height', `${inputHeight.val() ? inputHeight.val() + inputHeightType.val() : 'unset'}`);
            } else {
                activeSeElem.css('height', `${inputHeight.val() ? inputHeight.val() + inputHeightType.val() : 'unset'}`);
            }
        })
        inputHeightType.on('change', function () {
            if (activeElemType == 'img') {
                activeSeElem.find('img').css('height', `${inputHeight.val() + inputHeightType.val()}`);
            } else {
                activeSeElem.css('height', `${inputHeight.val() + inputHeightType.val()}`);
            }
        })


        //Font size
        inputFontSize.val(fontSizeRange.val());
        fontSizeRange.on('input', function () {
            inputFontSize.val(fontSizeRange.val());
            activeSeElem.css('font-size', `${fontSizeRange.val() ? fontSizeRange.val() + 'px' : 'unset'}`);
        })
        inputFontSize.on('input', function () {
            fontSizeRange.val(inputFontSize.val());
            activeSeElem.css('font-size', `${inputFontSize.val() ? inputFontSize.val() + 'px' : 'unset'}`);
        })

        //Text Align
        inputTextAlign.on('change', function () {
            activeSeElem.css('text-align', inputTextAlign.val());
        })

        //Font Weight
        inputFontWeight.on('change', function () {
            activeSeElem.css('font-weight', inputFontWeight.val());
        })

        //Font Style
        inputFontStyle.on('change', function () {
            activeSeElem.css('font-style', inputFontStyle.val());
        })

        //Color
        inputBgColor.on('blur', function () {
            activeSeElem.css('background', `${inputBgColor.val()}`);
        })
        inputFontColor.on('blur', function () {
            activeSeElem.css('color', `${inputFontColor.val()}`);
        })

        //Margin
        elemMarginItem.on('input', function () {
            let isLinked = $(this).parent().parent().find('.is-linked').is(':checked');
            if (isLinked) {
                elemMarginItem.val($(this).val());
            }

            activeSeElem.css('margin', `${inputMarginTop.val() ? inputMarginTop.val() + 'px' : 'unset'} ${inputMarginRight.val() ? inputMarginRight.val() + 'px' : 'unset'} ${inputMarginBottom.val() ? inputMarginBottom.val() + 'px' : 'unset'} ${inputMarginLeft.val() ? inputMarginLeft.val() + 'px' : 'unset'}`);
        })

        //Padding
        elemPaddingItem.on('input', function () {
            let isLinked = $(this).parent().parent().find('.is-linked').is(':checked');
            if (isLinked) {
                elemPaddingItem.val($(this).val());
            }

            activeSeElem.css('padding', `${inputPaddingTop.val() ? inputPaddingTop.val() + 'px' : 'unset'} ${inputPaddingRight.val() ? inputPaddingRight.val() + 'px' : 'unset'} ${inputPaddingBottom.val() ? inputPaddingBottom.val() + 'px' : 'unset'} ${inputPaddingLeft.val() ? inputPaddingLeft.val() + 'px' : 'unset'}`);
        })

        //Border

        inputBorderSize.on('input', function () {
            activeSeElem.css('border-width', `${inputBorderSize.val() ? inputBorderSize.val() + 'px' : 'unset'}`)
        })
        inputBorderColor.on('blur', function () {
            activeSeElem.css('border-color', inputBorderColor.val())
        })
        elemBorderItemSelect.on('change', function () {
            let isLinked = $(this).parent().parent().find('.is-linked').is(':checked');
            if (isLinked) {
                elemBorderItemSelect.val($(this).val());
            }
            activeSeElem.css('border-style', `${borderTop.val()} ${borderRight.val()} ${borderBottom.val()} ${borderLeft.val()}`)
        })

        //Border Radius
        elemBorderRadiusItem.on('input', function () {
            let isLinked = $(this).parent().parent().find('.is-linked').is(':checked');
            if (isLinked) {
                elemBorderRadiusItem.val($(this).val());
            }

            activeSeElem.css('border-radius', `${inputRadiusTop.val() ? inputRadiusTop.val() + 'px' : 'unset'} ${inputRadiusRight.val() ? inputRadiusRight.val() + 'px' : 'unset'} ${inputRadiusBottom.val() ? inputRadiusBottom.val() + 'px' : 'unset'} ${inputRadiusLeft.val() ? inputRadiusLeft.val() + 'px' : 'unset'}`);
        })

        //Box Shadow
        elemShadowItem.on('input', function () {
            let isLinked = $(this).parent().parent().find('.is-linked').is(':checked');
            if (isLinked) {
                elemShadowItem.val($(this).val());
            }
            activeSeElem.css('box-shadow', `${shadowX.val() ? shadowX.val() + 'px' : '0'} ${shadowY.val() ? shadowY.val() + 'px' : '0'} ${shadowBlur.val() ? shadowBlur.val() + 'px' : '0'} ${shadowSpread.val() ? shadowSpread.val() + 'px' : '0'} ${shadowColor.val()}`);
        })

        shadowColor.on('blur', function () {
            activeSeElem.css('box-shadow', `${shadowX.val()}px ${shadowY.val()}px ${shadowBlur.val()}px ${shadowSpread.val()}px ${shadowColor.val()}`);
        })
        //code highlighter
        inputCodeType.on('change', function () {
            activeSeElem.html(`<script type="text/plain" class="${inputCodeType.val()}">${seEditorTextarea.val()}</script>`);
            Prism.highlightElement(activeSeElem.find('script')[0]);
        })

        //Functions

        function setSeEditorStyle(elem, elemType) {
            let fontSize;
            if (elem.css('font-size').includes('px')) {
                fontSize = elem.css('font-size').split('p')[0];
            }

            if (elemType == 'img') {
                seEditorTextarea.addClass('d-none');
                seEditorImg.removeClass('d-none');
                inputCodeType.addClass('d-none').removeClass('d-block')
                seEditorImg.attr('src', '../public/img/sample-img.png')

            } else if (elemType == 'code') {
                seEditorImg.addClass('d-none');
                seEditorTextarea.val(elem.find('pre').text());
                seEditorTextarea.removeClass('d-none');
                inputCodeType.removeClass('d-none').addClass('d-block');
            } else if (elemType == 'iframe') {
                inputCodeType.addClass('d-none')
                seEditorTextarea.addClass('d-none');
                seEditorImg.addClass('d-none');
            } else {
                inputCodeType.addClass('d-none').removeClass('d-block');
                seEditorTextarea.removeClass('d-none');
                seEditorImg.addClass('d-none');
                seEditorTextarea.val(elem.text());
            }


            inputFontSize.val(fontSize);
            fontSizeRange.val(fontSize);
            inputFontWeight.val(elem.css('font-weight'));
            inputFontStyle.val(elem.css('font-style'));
            inputTextAlign.val(elem.css('text-align'));
            inputBgColor.val(elem.css('background-color')).css('background-color', elem.css('background-color'));
            inputFontColor.val(elem.css('color')).css('background-color', elem.css('color'));
            //margin
            inputMarginTop.val(elem.css('margin-top').split('p')[0]);
            inputMarginRight.val(elem.css('margin-right').split('p')[0]);
            inputMarginBottom.val(elem.css('margin-bottom').split('p')[0]);
            inputMarginLeft.val(elem.css('margin-left').split('p')[0]);
            //padding
            inputPaddingTop.val(elem.css('padding-top').split('p')[0]);
            inputPaddingRight.val(elem.css('padding-right').split('p')[0]);
            inputPaddingBottom.val(elem.css('padding-bottom').split('p')[0]);
            inputPaddingLeft.val(elem.css('padding-left').split('p')[0]);
            //border
            let borderStyleArr = elem.css('border-style').split(' ');
            switch (borderStyleArr.length) {
                case 0:
                    elemBorderItemSelect.val('none');
                    break;
                case 1:
                    elemBorderItemSelect.val(borderStyleArr[0]);
                    break;
                case 2:
                    borderTop.val(borderStyleArr[0]);
                    borderBottom.val(borderStyleArr[0]);
                    borderLeft.val(borderStyleArr[1]);
                    borderRight.val(borderStyleArr[1]);
                case 3:
                    borderTop.val(borderStyleArr[0]);
                    borderBottom.val(borderStyleArr[2]);
                    borderLeft.val(borderStyleArr[1]);
                    borderRight.val(borderStyleArr[1]);
                case 4:
                    borderTop.val(borderStyleArr[0]);
                    borderRight.val(borderStyleArr[1]);
                    borderBottom.val(borderStyleArr[2]);
                    borderLeft.val(borderStyleArr[3]);
            }
            inputBorderSize.val(elem.css('border-width').split('p')[0]);
            inputBorderColor.val(elem.css('border-color')).css('background-color', elem.css('border-color'));
            //border radius
            inputRadiusTop.val(elem.css('border-top-left-radius').split('p')[0]);
            inputRadiusRight.val(elem.css('border-top-right-radius').split('p')[0]);
            inputRadiusBottom.val(elem.css('border-bottom-right-radius').split('p')[0]);
            inputRadiusLeft.val(elem.css('border-bottom-left-radius').split('p')[0]);
            //box shadow

            let shadowArr = elem.css('box-shadow').split(')');
            let shadowColorStr = `${shadowArr[0]})`;
            if (!shadowColorStr.includes('none')) {
                shadowColor.val(shadowColorStr).css('background-color', shadowColorStr);
            } else {
                shadowColor.val('#000000').css('background-color', '#000000');
            }

            if (shadowArr[1]) {
                let shadowVals = shadowArr[1].trim();
                let shadowValArr = shadowVals.split(' ');
                shadowX.val(shadowValArr[0].split('p')[0]);
                shadowY.val(shadowValArr[1].split('p')[0]);
                shadowBlur.val(shadowValArr[2].split('p')[0]);
                shadowSpread.val(shadowValArr[3].split('p')[0]);
            } else {
                elemShadowItem.val(0);
            }



        }

        // PREVIEW
        $('.btn-next').click(function () {
            $('#se-blog-content > *').removeClass('active')
        })

    }

    function getBase64(file) {
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                let blob = reader.result
                resolve(blob)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
                reject(error)
            };
        })
    }


})