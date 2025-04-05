function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

/**
 *
 * ANIMATION SHOW SECTION
 *
 */
$(function () {
  AOS.init({
    // Global settings:
    disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
    startEvent: "DOMContentLoaded", // name of the event dispatched on the document, that AOS should initialize on
    initClassName: "aos-init", // class applied after initialization
    animatedClassName: "aos-animate", // class applied on animation
    useClassNames: true, // if true, will add content of `data-aos` as classes on scroll
    disableMutationObserver: true, // disables automatic mutations' detections (advanced)
    debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
    throttleDelay: 0, // the delay on throttle used while scrolling the page (advanced)

    // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
    offset: -300, // offset (in px) from the original trigger point
    delay: 0, // values from 0 to 3000, with step 50ms
    duration: 2000, // values from 0 to 3000, with step 50ms
    easing: "ease", // default easing for AOS animations
    once: true, // whether animation should happen only once - while scrolling down
    mirror: true, // whether elements should animate out while scrolling past them
    anchorPlacement: "top-bottom", // defines which position of the element regarding to window should trigger the animation
  });
});

/**
 *
 * END ANIMATION SHOW SECTION
 *
 */

/**
 *
 * SHOW LOADING SECTION
 *
 */
$(window).on("load", function () {
  setTimeout(removeLoader, 500); //wait for page load PLUS x second
});

function removeLoader() {
  $("#loadingDiv").fadeOut(500, function () {
    // fadeOut complete. Remove the loading div
    $("#loadingDiv").remove(); //makes page more lightweight
  });
}
/**
 *
 * END SHOW LOADING SECTION
 *
 */

const IS_LOGOUT = "IS_LOGOUT";
const IS_LOGOUT_VALUE = {
  YES: "1",
  NO: "0",
};
// set IS_LOGOUT localstorage when current route is login.html or without-login.html
const is_without_login_route =
  location.pathname === "/login.html" ||
  location.pathname.includes("without-login.html");
if (is_without_login_route) {
  localStorage.setItem(IS_LOGOUT, IS_LOGOUT_VALUE.YES);
} else {
  localStorage.setItem(IS_LOGOUT, IS_LOGOUT_VALUE.NO);
}

// Translator

const LANGUAGES = {
  EN: "EN",
  CH: "CH",
  SG_EN: "SG_EN",
  SG_CH: "SG_CH",
  MY_EN: "MY_EN",
  MY_CH: "MY_CH",
  BN_EN: "BN_EN",
  BN_CH: "BN_CH",
  VN_EN: "VN_EN",
  VN_CH: "VN_CH",
  ID_EN: "ID_EN",
  ID_CH: "ID_CH",
  KH_EN: "KH_EN",
  KH_CH: "KH_CH",
  INT_EN: "INT_EN",
  INT_CH: "INT_CH",
};
const PREFERED_REGION = "preferred_region";
const PREFERED_LANGUAGE = "preferred_language";

const LANGUAGES_ARRAY = Object.values(LANGUAGES);
console.log(LANGUAGES_ARRAY);

var translator = new Translator({
  defaultLanguage: "en",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: true,
  persistKey: PREFERED_LANGUAGE,
  filesLocation: "assets/i18n",
  // filesLocation: "https://raw.githubusercontent.com/huylesitdn/uwin-mobile/main/assets/i18n",
});

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const langParams = urlParams.get("lang");

const _get_translator_config =
  translator.config.persistKey || PREFERED_LANGUAGE;
const _get_language =
  langParams || localStorage.getItem(_get_translator_config) || LANGUAGES.EN;
const _get_region = localStorage.getItem(PREFERED_REGION) || "Singapore";

translator.fetch(LANGUAGES_ARRAY).then(() => {
  // -> Translations are ready...
  const current_language = LANGUAGES_ARRAY.includes(_get_language)
    ? _get_language
    : LANGUAGES.EN;
  translator.translatePageTo(current_language);
  changeLanguage();
  initialize();
});

/**
 * MENU SLIDE
 *
 */

$("#navMenu, #nav-menu").on("click", function (e) {
  e.preventDefault();
  $("#mySidenav").addClass("active");
});

$(
  "#mySidenav .backdrop, #mySidenav a.left-nav__top__nav__item__link, #mySidenav .close-nav"
).on("click", function (e) {
  $("#mySidenav").removeClass("active");
});

const selectLanguageModalElm = $("#selectLanguage");
if (selectLanguageModalElm.length > 0) {
  var selectLanguageModal = new bootstrap.Modal(selectLanguageModalElm, {});
}
$(".choose-language").on("click", function (e) {
  const select_language = $(this).data("language");
  const select_region = $(this).data("region");
  const accept_languages = ["Malaysia", "Singapore"];

  if (!accept_languages.includes(select_region)) {
    window.location.href = "/access-denied.html";
    return false;
  }

  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    selectLanguageModal.hide();
    $("#mySidenav").removeClass("active");
    localStorage.setItem(PREFERED_REGION, select_region);
    changeLanguage();
    window.location.reload();
  } else {
    console.log("No language setup");
  }
});

// $(".btn-language").on("click", function (e) {
//   e.preventDefault();
//   const current_text = $(this).html();
//   switch (current_text) {
//     case "中":
//       translator.translatePageTo(LANGUAGES.ZH);
//       break;
//     case "EN":
//       translator.translatePageTo(LANGUAGES.EN);
//       break;
//     default:
//       break;
//   }
//   window.location.reload();
// });

$(".universal__content__language").on("click", function (e) {
  const select_language = $(this).data("language");
  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    window.location.href = "/";
  } else {
    console.log("No language setup");
  }
});

$(".universal .play-now a").on("click", function (e) {
  e.preventDefault();
  const slick_current_select = $(
    "#selectLanguage .slick-list .slick-track .slick-current .title"
  );
  if (slick_current_select.length > 0) {
    const slick_current_select_title = slick_current_select.data("i18n");
    const accept_languages = [
      "universal_page.Malaysia",
      "universal_page.Singapore",
    ];
    if (accept_languages.includes(slick_current_select_title)) {
      window.location.href = "/login.html";
    } else {
      window.location.href = "/access-denied.html";
    }
  }
});

$("#mySidenav #collapseCountry .collapse__item").on("click", function () {
  const select_region = $(this).data("region");
  localStorage.setItem(PREFERED_REGION, select_region);
  changeLanguage();
  const collapseCountryElm = $("#collapseCountry");
  if (collapseCountryElm.length > 0) {
    const collapseCountry = new bootstrap.Collapse(collapseCountryElm, {});
    collapseCountry.hide();
  }
});

function changeLanguage() {
  const _get_region = localStorage.getItem(PREFERED_REGION) || "Singapore";
  $(".choose-language").each(function () {
    const get_attr_lang = $(this).data("language").toLowerCase();
    const get_attr_region = $(this).data("region");
    if (_get_language == get_attr_lang && _get_region == get_attr_region) {
      $(this).addClass("text-primary");
    }
  });

  const current_country = translator.translateForKey(
    "menu.Uwin33_" + _get_region,
    _get_language
  );
  $("#mySidenav .current-country").text(current_country);

  $("#mySidenav #collapseCountry .collapse__item").each(function () {
    const get_attr_region = $(this).data("region");
    if (_get_region == get_attr_region) {
      $(this).addClass("active");
    } else {
      $(this).removeClass("active");
    }
  });
}

/**
 * MENU SLIDE
 *
 */

function copyFunction(id) {
  /* Get the text field */
  var copyText = document.getElementById(id);

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  /* Copy the text inside the text field */
  navigator.clipboard.writeText(copyText.value);

  var toastCopyEl = document.getElementById("copiedToast");
  var toastCopyList = bootstrap.Toast.getOrCreateInstance(toastCopyEl);
  toastCopyList.show();
}

/**
 *
 * INITIAL AFTER HAVE translator
 *
 */

function initialize() {
  // change text of current_text
  switch (_get_language) {
    case LANGUAGES.EN:
      $(".btn-language").html("中");
      break;
    case LANGUAGES.CH:
      $(".btn-language").html("EN");
      break;
    default:
      break;
  }

  // default select language
  const language_items = $(".language-item").find(".language-select");
  language_items.each(function () {
    const language_item = $(this);
    const language_item_language = language_item.data("language");
    const language_item_region = language_item.data("region");
    if(language_item_language == _get_language && language_item_region == _get_region) {
      const language_item_parent = language_item.closest('.language-item');
      language_item.addClass("selected");
      language_item_parent.addClass("active");

    }
  });


  $("#selectLanguageModalBtn, #regions-currencies-languages").on("click", function (e) {
    e.preventDefault();
    console.log("click open language modal");
    // $("#selectLanguageModal").showModal();
    $("#selectLanguageModal").attr("open", true);
    $("#mySidenav").removeClass("active");
  });


  $(".language-item").on("click", function (e) {
    e.preventDefault();
    $(".language-item").removeClass("active");
    $(this).addClass("active");

    const language_item = $(this).closest(".language-item").find(".language-select");
    const first_language_item = language_item[0];
    const _first_language = first_language_item.dataset.language;
    const _first_region = first_language_item.dataset.region;
    if(first_language_item) {
      translator.translatePageTo(_first_language);
      localStorage.setItem(PREFERED_REGION, _first_region);
      localStorage.setItem(PREFERED_LANGUAGE, _first_language);
      $(first_language_item).addClass("selected");
    }
  });

  $(".language-select").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const language_select = $(this);
    const language_select_language = language_select.data("language");
    const language_select_region = language_select.data("region");
    console.log('language_select_language', language_select_language);
    console.log('language_select_region', language_select_region);
    translator.translatePageTo(language_select_language);
    localStorage.setItem(PREFERED_REGION, language_select_region);
    localStorage.setItem(PREFERED_LANGUAGE, language_select_language);
    $(".language-item").removeClass("active");
    language_select.closest(".language-item").addClass("active");

    $(".language-select").removeClass("selected");
    language_select.addClass("selected");
  });
}

console.log("--- index.jsaaa");
