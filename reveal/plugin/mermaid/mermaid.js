(function(){

  function fixUpSvgSize(divElem, svgElem) {
    var width = svgElem.getAttribute('width');
    var height = svgElem.getAttribute('height');
    var divWidth = divElem.offsetWidth;
    var divHeight = divElem.offsetHeight;

    if (width > divWidth || height > divHeight) {
      var viewBox = '0 0 ' + width + ' ' + height;
      svgElem.setAttribute('viewBox', viewBox);
      svgElem.setAttribute('width', divElem.offsetWidth);
      svgElem.setAttribute('height', divElem.offsetHeight);
    }
  }

  function getDataElem(slide) {
    var children = slide.getElementsByClassName('mermaid');
    var divs = Array.prototype.filter.call(children, function(element) {
      return element.nodeName === 'DIV';
    });

    return divs;
  }

  function destroyDiagram(slide) {
    // var svgDiv = getDisplayDiv(slide);
    // while (svgDiv.firstChild) {
    //   svgDiv.removeChild(svgDiv.firstChild);
    // }
    // svgDiv.removeAttribute("data-processed");
    var svgDivs = getDataElem(slide);
    svgDivs.forEach(function(svgDiv){
      while (svgDiv.firstChild) {
        svgDiv.removeChild(svgDiv.firstChild);
      }
      svgDiv.removeAttribute("data-processed");
    });
  }

  function showDiagram(slide) {
    var dataElems = getDataElem(slide);
    dataElems.forEach(function(dataElem){
      var svgDiv = dataElem;

      var config = {
        startOnLoad: false,
        cloneCssStyles: false
      };
      mermaid.init(config, svgDiv);

      // Fix up svg element size
      var svgElem = svgDiv.getElementsByTagName("svg")[0];
      if (svgElem) {
        fixUpSvgSize(svgDiv, svgElem);
      }
    });

  }

  Reveal.addEventListener( 'slidechanged', function( event ) {
    if (event.previousSlide) {
      // destroyDiagram(event.previousSlide);
    }

    if (event.currentSlide) {
      showDiagram(event.currentSlide);
    }
  });

  Reveal.addEventListener('ready', function( event ) {
    if (event.currentSlide) {
      showDiagram(event.currentSlide);
    }
  });

}());
