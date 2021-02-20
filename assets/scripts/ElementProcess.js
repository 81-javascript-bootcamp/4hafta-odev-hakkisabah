class ElementProcess {
  constructor(tableElements) {
    this.tableElements(tableElements);
  }

  tableElements(DOMElements) {
    // Döngü ile kullanımı
    // for(let i =0;i<DOMElements.length;i++){
    //     if (DOMElements[i]['parent']){
    //         this[DOMElements[i].variableName] = this[DOMElements[i].parent][DOMElements[i].methodName](DOMElements[i].params)
    //     }else{
    //         this[DOMElements[i].variableName] = document[DOMElements[i].methodName](DOMElements[i].params)
    //     }
    // }
    // ---
    // Daha anlaşılır ve sırasıyla parametrik kullanımı
    // Not : configurations.js de bulunan tableElements sabitinden alınan değerler ile parametrize edilmiştir
    const [root, childEl, searchInput, searchForm] = DOMElements;
    this[root.variableName] = document[root.methodName](root.params); // kullanımı : this.$tableEl
    this[childEl.variableName] = this[childEl.parent][childEl.methodName](
      // kullanımı : this.$tbodyEl
      childEl.params
    );
    this[searchInput.variableName] = document[searchInput.methodName](
      // kullanımı : this.$searchInput
      searchInput.params
    );
    this[searchForm.variableName] = document[searchForm.methodName](
      // kullanımı : this.$searchForm
      searchForm.params
    );
  }

  // main.js te bulunan MoviesApp mirasçısına ait renderFilters() methodu tarafından tetiklenir
  filterElementCreator(filterElementProps, movieFilterValue, countedArr) {
    // inclusiveElement sabiti filtrenin ana kapsayıcı etiket adresini belirler
    const $inclusiveElement = document.querySelector(
      filterElementProps.parentId
    );
    // renderFilters() tarafından orderedData argümanu burada movieFilterValue parametresi olarak kullanılır.
    for (let i = 0; i < [...movieFilterValue].length; i++) {
      $inclusiveElement.innerHTML += `<div class="form-check"><input class="form-check-input" type="${
        filterElementProps.type
      }" name="${filterElementProps.name}" id="${
        filterElementProps.name
      }-${i}" value="${
        movieFilterValue[i]
      }"><label for="year-${i}" class="form-check-label">${
        movieFilterValue[i]
        // countedArr parametresi countedData olarak gönderilir ve içeriği, "Yıl : Kaç defa tekrarladığı" şeklindedir.
        // döngüde kullanılan movieFilterValue[i] sıralanmış filtre değerleri countedArr 'da anahtar olarak kullanılır ve filtre elemanına ait
        // değerin kaç adet tekrarladığı bu şekilde gösterilir.
      } (${countedArr[movieFilterValue[i]]})</label></div>`;
    }
    return this.filterButtonCreator(
      $inclusiveElement,
      filterElementProps.button.id
    );
  }

  filterButtonCreator(parentElement, buttonElementId) {
    const button = document.createElement("button");
    button.id = buttonElementId;
    button.type = "submit";
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.innerText = "Filter";
    parentElement.append(button);
    return button;
  }

  createMovieLine(movie) {
    let { image, title, genre, year, id } = movie;
    return `<tr data-id="${id}"><td><img src="${image}" onerror="this.src='assets/images/no-image-found-360x250.png'"></td><td class="column-width">${title}</td><td>${genre}</td><td>${year}</td></tr>`;
  }
}
export default ElementProcess;
