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
  setTimeout(removeLoader, 1000); //wait for page load PLUS x second
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
const PREFERED_REGION = "B9_PREFERED_REGION";
const PREFERED_LANGUAGE = "B9_PREFERED_LANGUAGE";
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
  // filesLocation: "https://raw.githubusercontent.com/huyledntech/b9-revamp-mobile/main/assets/i18n",
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
  const default_tab_active = $(
    ".custom-tabs .tab input[type='radio']:checked"
  ).val();
  if (default_tab_active) {
    // set default tab content active
    const default_tab_content = $(
      ".custom-tabs .tab-content-list .tab-content-item"
    ).eq(default_tab_active - 1);
    default_tab_content.addClass("active");
  }

  // change tab content when click tab
  $(".custom-tabs .tab input[type='radio']").on("change", function () {
    // remove active class from all tab content
    $(".custom-tabs .tab-content-list .tab-content-item").removeClass("active");
    // add active class to the clicked tab content
    const tab_active = $(this).val();
    const tab_content = $(
      ".custom-tabs .tab-content-list .tab-content-item"
    ).eq(tab_active - 1);
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
  $("#draw-btn").on("click", function () {
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
      const random_modal =
        modal_list[Math.floor(Math.random() * modal_list.length)];
      random_modal.attr("open", true);
    }, 500);
  });
  /**
   * END POKER KING
   */

  /**
   * NAVBAR ACCORDION
   */
  const navbar_accordion = document.getElementById("navbar_accordion");
  const navbar_accordion_input = $("#navbar_accordion input");
  const navbar_accordion_icon = $("#navbar_accordion i");
  const top_nav_child = $("#top-nav-child");

  // show default active accordion navbar except promotions page
  if(!location.pathname.includes("promotions")) {
    setTimeout(() => {
      navbar_accordion && navbar_accordion.click()
    }, 1000);
  }
  navbar_accordion_input.on("change", function () {
    const is_checked = $(this).is(":checked");
    if (is_checked) {
      navbar_accordion_icon.css("transform", "rotate(180deg)");
      top_nav_child.removeClass("hidden");
    } else {
      navbar_accordion_icon.css("transform", "rotate(0deg)");
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
  inbox_tab_edit.on("change", function () {
    const is_checked = $(this).is(":checked");
    const inbox_table_checkbox_container = $(
      ".inbox-table .checkbox-container"
    );
    const show_delete_icon = $(".tabs-inbox .show-delete-icon");
    const hide_delete_icon = $(".tabs-inbox .hide-delete-icon");
    const inbox_table_action_button = $(".inbox-table .action button");
    const inbox_table_action_link = $(".inbox-table .action a");

    if (is_checked) {
      show_delete_icon.addClass("hidden");
      hide_delete_icon.removeClass("hidden");
      inbox_table_action_button.removeClass("hidden");
      inbox_table_action_link.addClass("hidden");
    } else {
      show_delete_icon.removeClass("hidden");
      hide_delete_icon.addClass("hidden");
      inbox_table_action_button.addClass("hidden");
      inbox_table_action_link.removeClass("hidden");
    }
    const inbox_actions_nav = $(".inbox-actions-nav");
    if (is_checked) {
      inbox_table_checkbox_container.removeClass("hidden");
      inbox_actions_nav.removeClass("hidden");
    } else {
      inbox_table_checkbox_container.addClass("hidden");
      inbox_actions_nav.addClass("hidden");
    }
  });
  const inbox_select_all = $("#inbox_select_all");
  inbox_select_all.on("change", function () {
    const is_checked = $(this).is(":checked");
    const inbox_table_checkbox = $(
      ".inbox-table .checkbox-container input[type='checkbox']"
    );
    inbox_table_checkbox.prop("checked", is_checked);
  });
  /**
   * END INBOX
   */

  /**
   * SELECT2
   */
  $("select").each(function () {
    var firstOption = $(this).children("option[disabled][selected]").first();
    const placeholder = firstOption.length > 0 ? firstOption.text() : "Select";
    firstOption.html("");
    $(this).select2({
      minimumResultsForSearch: Infinity,
      dropdownParent: $(this).parent(),
      dropdownCssClass: "select2-custom-dropdown",
      placeholder: placeholder || "Select",
      // allowClear: true,
      templateResult: function (data) {
        const description = $(data.element).data("description");
        if (!description) {
          return data.text;
        }
        return $(
          `<div class="flex justify-between">
            <span>${data.text}</span>
            <span class="">${description}</span>
          </div>`
        );
      },
      templateSelection: function (data) {
        const description = $(data.element).data("description");
        if (!description) {
          return data.text;
        }
        return $(
          `<div class="flex justify-between font-semibold">
            <span>${data.text}</span>
            <span class="">${description}</span>
          </div>`
        );
      },
    });
  });
  /**
   * SELECT2
   */

  /**
   * DEPOSIT PAGE
   */
  $(".copy-address-btn").on("click", function () {
    const address = $(this).data("address");
    navigator.clipboard.writeText(address);
    const copied_text = translator.translateForKey(
      "deposit_page.copied",
      _get_language
    );
    $(this).children(".text").text(copied_text);
  });
  /**
   * END DEPOSIT PAGE
   */

  /**
   * DEFAULT OPEN MODAL
   */
  setTimeout(() => {
    const default_open_modal = urlParams.get("modal");
    if (default_open_modal) {
      const modal = document.getElementById(default_open_modal);
      modal && modal.showModal();
      window.history.pushState({}, document.title, window.location.pathname);
    }
  }, 2000);
  /**
   * END DEFAULT OPEN MODAL
   */

  /**
   * SIDEBAR COLLAPSE
   */
  const sidebar_collapse = $(".sidebar-collapse input[type='checkbox'], .vip-faq-item input[type='checkbox'], .footer-collapse input[type='checkbox'], .B92U-bank-collapse input[type='checkbox']");
  sidebar_collapse.on("change", function () {
    const is_checked = $(this).is(":checked");
    const sidebar_collapse_value = $(this).val();
    sidebar_collapse.each(function () {
      if ($(this).val() !== sidebar_collapse_value) {
        $(this).prop("checked", false);
      }
    });
  });
  /**
   * END SIDEBAR COLLAPSE
   */

  /**
   * VIP LEVEL
   */
  const VIP_LEVELS = {
    NORMAL: "normal",
    BRONZE: "bronze",
    SILVER: "silver",
    ROSE_GOLD: "rose_gold",
    GOLD: "gold",
    PLATINUM: "platinum",
    DIAMOND: "diamond",
  };
  const vipOrder = Object.values(VIP_LEVELS);

  // current user vip level
  const current_vip_level = $(".vip-level-table #current-vip-level");
  const current_vip_level_value = current_vip_level.val();

  // active vip level
  const slider_active_vip_level = $(".vip-level-table #slider-active-vip-level");
  const slider_active_vip_level_value = slider_active_vip_level.val(current_vip_level_value);
  
  const vip_title_slider_prev = $(".vip-level-table .vip-title-slider-prev");
  const vip_title_slider_next = $(".vip-level-table .vip-title-slider-next");

  function showNextVip(currentLevel, isFirst = false) {
    const vip_title_slider = $(".vip-level-table .vip-title-slider");
    const vip_level_table = $(".vip-level-table");
    const currentIndex = vipOrder.indexOf(currentLevel);
    const nextIndex = !isFirst ? currentIndex : Math.min(currentIndex + 1, vipOrder.length - 1);
    const nextLevel = vipOrder[nextIndex];

    console.log('currentLevel', currentLevel);
    console.log('nextLevel', nextLevel);

    // hide all vip level in thead
    vip_title_slider.find("div[data-level]").addClass("hidden");

    // show next vip level in thead
    const nextDiv = vip_title_slider.find(`div[data-level="${nextLevel}"]`);
    if (nextDiv) nextDiv.removeClass("hidden");

    // hide all vip level in tbody
    vip_level_table.find("td[data-level]").addClass("hidden");

    // show next vip level in tbody
    const nextTd = vip_level_table.find(`td[data-level="${nextLevel}"]`);
    if (nextTd) nextTd.removeClass("hidden");


    // disable next button if current level is diamond
    vip_title_slider_next.prop("disabled", nextLevel === VIP_LEVELS.DIAMOND);

    // disable prev button if current level is normal
    vip_title_slider_prev.prop("disabled", nextLevel === VIP_LEVELS.NORMAL);

    // update current active vip level
    slider_active_vip_level.val(nextLevel);
  }
  // show default next vip level
  showNextVip(current_vip_level_value, true);

  vip_title_slider_prev.on("click", function () {
    const currentLevel = slider_active_vip_level_value.val();
    const prevLevel = vipOrder[vipOrder.indexOf(currentLevel) - 1];
    showNextVip(prevLevel);
  });

  vip_title_slider_next.on("click", function () {
    const currentLevel = slider_active_vip_level_value.val();
    const nextLevel = vipOrder[vipOrder.indexOf(currentLevel) + 1];
    showNextVip(nextLevel);
  });

  /**
   * END VIP LEVEL
   */

  /**
   * HISTORY PAGE
   */
  const history_content_select = $(".history-content .history-content-select");
  history_show_table(history_content_select.val());
  history_content_select.on("change", function () {
    const selected_value = $(this).val();
    history_show_table(selected_value);
  });
  function history_show_table(value) {
    $(".history-content .history-content-table > div").addClass("hidden");
    const selected_table = $(`.history-content .${value}-table`);
    selected_table.removeClass("hidden");
  }
  /**
   * HISTORY PAGE
   */


  /**
   * HOME PAGE MODAL
   */
  const home_page_default_time = 3000;
  const message_from_b9_modal = document.getElementById("message_from_b9_modal");
  const maximize_your_rewards_modal = document.getElementById("maximize_your_rewards_modal");
  const daily_mystery_reward_awaiting_modal = document.getElementById("daily_mystery_reward_awaiting_modal");
  const introducing_bonus_mania_modal = document.getElementById("introducing_bonus_mania_modal");
  const never_miss_a_bonus_modal = document.getElementById("never_miss_a_bonus_modal");

  setTimeout(() => {
    message_from_b9_modal && message_from_b9_modal.showModal();
  }, home_page_default_time);
  setTimeout(() => {
    maximize_your_rewards_modal && maximize_your_rewards_modal.showModal();
    message_from_b9_modal && message_from_b9_modal.close();
  }, home_page_default_time * 2);
  setTimeout(() => {
    daily_mystery_reward_awaiting_modal && daily_mystery_reward_awaiting_modal.showModal();
    maximize_your_rewards_modal && maximize_your_rewards_modal.close();
  }, home_page_default_time * 3);
  setTimeout(() => {
    introducing_bonus_mania_modal && introducing_bonus_mania_modal.showModal();
    daily_mystery_reward_awaiting_modal && daily_mystery_reward_awaiting_modal.close();
  }, home_page_default_time * 4);
  setTimeout(() => {
    never_miss_a_bonus_modal && never_miss_a_bonus_modal.showModal();
    introducing_bonus_mania_modal && introducing_bonus_mania_modal.close();
  }, home_page_default_time * 5);
  setTimeout(() => {
    never_miss_a_bonus_modal && never_miss_a_bonus_modal.close();
  }, home_page_default_time * 6);
  /**
   * HOME PAGE MODAL
   */

  /**
   * TOGGLE BALANCE
   */
  let show_balance = true;
  const balance_amount = "MYR 520.50";
  const main_wallet_amount = "MYR 320.50";
  const B92U_bank_amount = "MYR 220.00";
  const turnover_require_to_withdraw = "MYR 185.50";
  const amount_hide = "****";
  $(".balance_amount").text(balance_amount);
  $("#main_wallet_amount").text(main_wallet_amount);
  $("#B92U_bank_amount").text(B92U_bank_amount);
  $("#turnover_require_to_withdraw").text(turnover_require_to_withdraw);
  $(".toggle_balance").on("click", function (e) {
    e.preventDefault();
    show_balance = !show_balance;
    $(".toggle_balance .hide_balance").toggleClass("hidden");
    $(".toggle_balance .show_balance").toggleClass("hidden");
    if (show_balance) {
      $(".balance_amount").text(balance_amount);
      $("#main_wallet_amount").text(main_wallet_amount);
      $("#B92U_bank_amount").text(B92U_bank_amount);
      $("#turnover_require_to_withdraw").text(turnover_require_to_withdraw);
    } else {
      $(".balance_amount").text(amount_hide);
      $("#main_wallet_amount").text(amount_hide);
      $("#B92U_bank_amount").text(amount_hide);
      $("#turnover_require_to_withdraw").text(amount_hide);
    }
  });
  /**
   * END TOGGLE BALANCE
   */

  /**
   * COPY REFERRAL CODE
   */
  $("#copy_referral_code").on("click", function () {
    navigator.clipboard.writeText("YEBAQ4");
    const copied_text = translator.translateForKey(
      "deposit_page.copied",
      _get_language
    );
    $(this).text(copied_text);
  });
  /**
   * END COPY REFERRAL CODE
   */

  /**
  * CASINO GAME LOBBY
  */
  const pragmatic_play_tab = $('.tabs-casino-game .tab.pragmatic_play_tab');
  const game_lobby_tab = $('.tabs-casino-game .tab.game_lobby_tab');
  game_lobby_tab.on('click', function () {
    pragmatic_play_tab.addClass('hidden');
    game_lobby_tab.addClass('remove-tab-border');
  });

  $('.casino-game-lobby .item').on('click', function () {
    pragmatic_play_tab.click();
    pragmatic_play_tab.removeClass('hidden');
    game_lobby_tab.removeClass('remove-tab-border');
  });
  /**
  * CASINO GAME LOBBY
  */
   
}

console.log("--- index.jsaaa");
