import data from "./data.js";
import { tableElements, filterElementProps } from "./configuration.js";
import ElementProcess from "./ElementProcess.js";
import { makeBgActive, resetBg, searchMovieByTitle } from "./helpers.js";

// MovieApp HTML elementleri olmadan çıktı veremez ve bu yüzden element işlemlerinden miras alması gerekmektedir.
class MoviesApp extends ElementProcess {
  constructor(tableElements) {
    // Miras aldığı yerde elementlerin oluşması için configuration.js de bulunan tableElements sabitindeki bilgileri gönderir
    super(tableElements);
  }

  // init() methodu tarafından tetiklenen fillMovie() dahil edilen datayı kullanır.
  // moviesArr sabitine datadan gelen her film bilgisi, ElementProcess 'teki createMovieLine() methoduna gönderilir.
  // Gönderilen her film bilgisi tek bir satıra denk gelmektedir.
  // Yazdırılmadan önce, orderAndCountFilmsForFilter() methoduna yıllar ve türler gönderilir.
  fillMovie() {
    let years = [];
    let genres = [];
    // moviesArr data içerisinde bulunan filmere ait bilgilerin, HTML elemanına çevirilmiş işaretlemelerini içerir.
    const moviesArr = data
      .map((movie) => {
        // bir sonraki işlemde kullanılmak üzere filmlere ait yıllar ve türler dizilere aktarılır.
        years.push(movie.year);
        genres.push(movie.genre);
        return this.createMovieLine(movie);
      })
      .join("");
    // oluşturulan diziler sayılmak ve sıralanmak için gönderilir.
    this.orderAndCountFilmsForFilter({
      years,
      genres,
    });
    // Oluşturulan tüm satırlar bağlı HTML elementinin içine aktarılır.
    this.$tbodyEl.innerHTML = moviesArr;
  }

  // fillMovie() tarafından tetiklenen orderAndCountFilmsForFilter() methodu aldığı parametre dizisinin içinde bulunan yılları ve türleri sayar.
  // counted sabitine her eleman sayımı tamamlanmış tür ve yılların dizileri değer olarak atanır.
  // ayrı bir sabite dizi olarak atanmasının sebebi eşleştirme olarak kullanılırken kolaylık sağlayacaktır.
  orderAndCountFilmsForFilter(filteringData) {
    let counteddYears = [];
    data.forEach((film) => {
      counteddYears[film.year] = (counteddYears[film.year] || 0) + 1;
    });
    let countedGenres = [];
    data.forEach((film) => {
      countedGenres[film.genre] = (countedGenres[film.genre] || 0) + 1;
    });
    const counted = {
      years: counteddYears,
      genres: countedGenres,
    };
    // Not : Set() sınıfı tekrar eden bilgileri tek'e düşürür ve sağlıklı bir kullanım için rest parametresi ile birleştirilip dizi kümesine alınmıştır
    // Yıl filterisinin sıralaması
    filteringData.years = [
      ...new Set(
        filteringData.years.sort((a, b) => {
          return a - b;
        })
      ),
    ];
    // Tür filtresinin sıralaması
    filteringData.genres = [...new Set(filteringData.genres.sort())];
    // Sıralanan filtrelerin yazdırılma işlemi
    // Bu işlemde sıralanıp teke indirilen filtreler ve her bir filtre değerine ait toplam gönderilir.
    this.renderFilters(filteringData, counted);
  }

  // orderAndCountFilmsForFilter() tarafından tetiklenen renderFilters() methodu,
  // sıralama ve sayılma işlemleri bitmiş olan verilerin gerekli argümanlarla yazdırma işlemine gönderiir.
  renderFilters(orderedData, countedData) {
    // ElementProcess sınıfında bulunan filterElementCreator() methoduna ;
    // filterElementProps objesinde bulunan filtrelere ait element tip ve bağımlılık bilgileri,
    // Yıl ve tür olmak üzere ayrı ayrı gönderilir

    // Yıllar
    const createdYearFilter = this.filterElementCreator(
      // filterElementProps objesi configuration.js dosyasından alınmaktadır
      filterElementProps.year,
      orderedData.years,
      countedData.years
    );
    // filterElementCreator() methodundan createdYearFilter sabitine ilgili filtre bölümüne ait buton bilgileri geri döndürülür.
    // Daha sonra filterListenerHandler() methoduda buton bilgileri ve filtre edilecek yıl değerlerinin ortak ismi filterElementProps.year.name olarak gönderilir.
    // Bu argümanlar filtre butonundaki dinleyicide kullanılmak üzere oluşturulmuştur.
    this.filterListenerHandler(createdYearFilter, filterElementProps.year.name);

    // Yukarıdaki yıl filtresi için tanımlanmış tüm eşdeğer bilgiler Türler içinde geçerlidir.

    // Türler
    const createdGenreFilter = this.filterElementCreator(
      filterElementProps.genre,
      orderedData.genres,
      countedData.genres
    );
    this.filterListenerHandler(
      createdGenreFilter,
      filterElementProps.genre.name
    );
  }

  // Gönderilen her buton elementine bir dinleyici belirlenir.
  // Bu dinleyicinin görevi filtre listesindeki işaretlenmiş seçimlerin, tabloda eşeleşen satırlara arka planı atamaktır.
  // Her istek yapıldığında ilk önce tüm satırların arka planı resetBg() yardımcısıyla normale döndürülür.
  filterListenerHandler(element, handlerName) {
    element.addEventListener("click", () => {
      // resetBg() yardımcısı satırların arka planını normale döndürür.
      resetBg(this.$tbodyEl, "tr");
      // handlerName ile belirlenen filtre elementlerinin isimleriyle eşleşen ve işaretlenmiş seçimler getirilir.
      const selectedValues = this.handleFilter(handlerName);
      // Belirlenen seçimler filtre değerlerini içerir ve döngüye alınarak data da eşleşme olup olmadığı belirlenir.
      selectedValues.forEach((selected) => {
        data
          .filter((movie) => {
            // movie data içerisinde bulunan her bir dizi elemanına denk gelir.
            // Her dizi elemanı bir objedir ve objelerin HTML işaretleyicisinde ortak kullanmış olduğu
            // filterElementProps sabitindeki name özelliği burada handlerName olarak kullanılmaktadır.
            // Bu da data içerisinde year ya da genre ye denk gelmektedir.
            // Bu eşitlikte selected ile sağlanmaktadır.
            return movie[handlerName] === selected;
          })
          .forEach(makeBgActive); // eşitliği sağlanan tüm satırların makeBgActive yardımcısıyla arka planı değiştirilir
      });
    });
  }

  // filterListenerHandler() methodu tarafından tetiklenen handleFilter() hangi filtre kullanılmak isteniyorsa o filtreye ait elementte
  // name özelliğine sahip ve seçilmiş olanları kullanılmak üzere geri döndürür.
  handleFilter(handlerName) {
    const selectedFilter = Array.prototype.slice.call(
      document.querySelectorAll(`input[name='${handlerName}']:checked`)
    );
    const selected = selectedFilter.map((selected) => selected.value);
    return selected;
  }

  // Arama kutusu dinleyicisi..
  handleSearch() {
    this.$searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      resetBg(this.$tbodyEl, "tr");
      const searchValue = this.$searchInput.value;
      if (searchValue) {
        data
          .filter((movie) => {
            return searchMovieByTitle(movie, searchValue);
          })
          .forEach(makeBgActive);
        this.$searchInput.value = "";
      }
    });
  }

  init() {
    this.fillMovie();
    this.handleSearch();
  }
}
let myMoviesApp = new MoviesApp(tableElements);

myMoviesApp.init();
