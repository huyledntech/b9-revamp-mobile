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
};
const PREFERED_REGION = "preferred_region";
const PREFERED_LANGUAGE = "preferred_language";
const DEFAULT_LANGUAGE = LANGUAGES.EN;
const DEFAULT_REGION = "International";

const LANGUAGES_ARRAY = Object.values(LANGUAGES);
console.log(LANGUAGES_ARRAY);

var translator = new Translator({
  defaultLanguage: LANGUAGES.EN,
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

const reget_language = () => {
  return (
    langParams || localStorage.getItem(_get_translator_config) || LANGUAGES.EN
  );
};

const reget_region = () => {
  return localStorage.getItem(PREFERED_REGION) || DEFAULT_REGION;
};

const _get_translator_config =
  translator.config.persistKey || PREFERED_LANGUAGE;
const _get_language = reget_language();
const _get_region = reget_region();

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
  changeLanguageLabel();

  // default select language
  const language_items = $(".language-item").find(".language-select");
  language_items.each(function () {
    const language_item = $(this);
    const language_item_language = language_item.data("language");
    const language_item_region = language_item.data("region");
    if (
      language_item_language == _get_language &&
      language_item_region == _get_region
    ) {
      const language_item_parent = language_item.closest(".language-item");
      language_item.addClass("selected");
      language_item_parent.addClass("active");
    }
  });

  $("#selectLanguageModalBtn, #regions-currencies-languages").on(
    "click",
    function (e) {
      e.preventDefault();
      console.log("click open language modal");
      // $("#selectLanguageModal").showModal();
      $("#selectLanguageModal").attr("open", true);
      $("#mySidenav").removeClass("active");
    }
  );

  $(".language-item").on("click", function (e) {
    e.preventDefault();
    $(".language-item").removeClass("active");
    $(this).addClass("active");

    const language_item = $(this)
      .closest(".language-item")
      .find(".language-select");
    const first_language_item = language_item[0];
    const _first_language = first_language_item.dataset.language;
    const _first_region = first_language_item.dataset.region;
    if (first_language_item) {
      changeLanguage(_first_language, _first_region);
      $(first_language_item).addClass("selected");
    }
  });

  $(".language-select").on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    const language_select = $(this);
    const language_select_language = language_select.data("language");
    const language_select_region = language_select.data("region");
    changeLanguage(language_select_language, language_select_region);
    $(".language-item").removeClass("active");
    language_select.closest(".language-item").addClass("active");

    $(".language-select").removeClass("selected");
    language_select.addClass("selected");
  });

  function changeLanguageLabel() {
    const _get_language = reget_language();
    const language_label = _get_language.includes("CH") ? "EN" : "中";
    $(".btn-language").html(language_label);
  }

  function changeLanguage(language, region) {
    translator.translatePageTo(language);
    localStorage.setItem(PREFERED_REGION, region);
    localStorage.setItem(PREFERED_LANGUAGE, language);
    changeLanguageLabel();
  }

  /**
   * SWIPER
   */
  new Swiper(".home-slider-swiper", {
    direction: "horizontal",
    loop: true,
    pagination: {
      el: ".swiper-pagination",
    },
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
  });

  new Swiper(".topPickedSwiper", {
    slidesPerView: 2,
    spaceBetween: 30,
    watchSlideProgress: true,
    preventClicks: true,
    preventClicksPropagation: true,
    noSwiping: true,
    noSwipingSelector: "button",
    slideToClickedSlide: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  new Swiper(".vipLevelSwiper", {
    spaceBetween: 30,
  });

  /**
   * CUSTOM TABS
   */
  const default_tab_active = $(".custom-tabs .tab input[type='radio']:checked").val();
  if(default_tab_active) {
    // set default tab content active
    const default_tab_content = $(".custom-tabs .tab-content-list .tab-content-item").eq(default_tab_active - 1);
    default_tab_content.addClass("active");
  }

  // change tab content when click tab
  $(".custom-tabs .tab input[type='radio']").on("change", function() {
    // remove active class from all tab content
    $(".custom-tabs .tab-content-list .tab-content-item").removeClass("active");
    // add active class to the clicked tab content
    const tab_active = $(this).val();
    const tab_content = $(".custom-tabs .tab-content-list .tab-content-item").eq(tab_active - 1);
    tab_content.addClass("active");
  });
  /**
   * END CUSTOM TABS
   */

  /**
   * POKER KING
   */

  const poker_king_card_back = $(".poker-king .game-container .card-back");
  const poker_king_card_front = $(".poker-king .game-container .card-front");
  poker_king_card_front.addClass("hidden");
  const pokerKingCongratulationsModal = $("#pokerKingCongratulationsModal");
  const pokerKingRewardModal = $("#pokerKingRewardModal");
  const pokerKingLeaderboardModal = $("#pokerKingLeaderboardModal");
  const pokerKingOopsModal = $("#pokerKingOopsModal");
  $("#draw-btn").on("click", function() {
    poker_king_card_back.addClass("hidden");
    poker_king_card_front.removeClass("hidden");

    // reset card back
    setTimeout(() => {
      poker_king_card_back.removeClass("hidden");
      poker_king_card_front.addClass("hidden");
    }, 3000);

    // show random modal
    setTimeout(() => {
      const modal_list = [pokerKingCongratulationsModal, pokerKingOopsModal];
      const random_modal = modal_list[Math.floor(Math.random() * modal_list.length)];
      random_modal.attr("open", true);
    }, 500);

  });
  /**
   * END POKER KING
   */

  /**
   * NAVBAR ACCORDION
   */
  const navbar_accordion = $("#navbar-accordion");
  const navbar_accordion_input = $("#navbar-accordion input");
  const navbar_accordion_icon = $("#navbar-accordion i");
  const top_nav_child = $("#top-nav-child");
  navbar_accordion_input.on("change", function() {
    const is_checked = $(this).is(":checked");
    if (is_checked) {
      navbar_accordion_icon.css('transform', 'rotate(180deg)');
      top_nav_child.removeClass("hidden");
    } else {
      navbar_accordion_icon.css('transform', 'rotate(0deg)');
      top_nav_child.addClass("hidden");
    }
  });
  /**
   * END NAVBAR ACCORDION
   */

  /**
   * INBOX
   */
  const inbox_tab_edit = $(".tabs-inbox input[name='inbox-tab-edit']");
  inbox_tab_edit.on("change", function() {
    const is_checked = $(this).is(":checked");
    const inbox_table_checkbox_container = $(".inbox-table .checkbox-container");
    const inbox_actions_nav = $(".inbox-actions-nav");
    if (is_checked) {
      inbox_table_checkbox_container.removeClass("hidden");
      inbox_actions_nav.removeClass("hidden");
    } else {
      inbox_table_checkbox_container.addClass("hidden");
      inbox_actions_nav.addClass("hidden");
    }
  });
  /**
   * END INBOX
   */


}

console.log("--- index.jsaaa");
