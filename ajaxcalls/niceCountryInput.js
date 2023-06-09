$(document).ready(function () {
    $(".form-control").focus(function () {
      $(".niceCountryInputMenuFilter").hide();
      $(".niceCountryInputMenuDropdownContent").hide();
    });
    $("#phone").focus(function () {
      $(".niceCountryInputMenuFilter").hide();
      $(".niceCountryInputMenuDropdownContent").hide();
    });
    //  $('#contentDiv').on('click', function () {
    //   alert("vfvf");
    //   $(".niceCountryInputMenuFilter").hide();
    //    $(".niceCountryInputMenuDropdownContent").hide();
    // });
    $(".change").focusin(function () {
      // $(".niceCountryInputMenuFilter").show();
      // $(".niceCountryInputMenuDropdownContent").show();
    });
    $(".change").focusout(function () {
      // $(".niceCountryInputMenuFilter").hide();
      // $(".niceCountryInputMenuDropdownContent").hide();
    });
  });
  function NiceCountryInput(domElement) {
    /*Fixed variables*/
    this.domElement = domElement;
    /* check if already initialized before doing any work */
    if ($(this.domElement).data("initialized")) {
      this.log("Already initialized...");
      return;
    }
    /* i18n */
    this.i18nwait = this.escapeHTML(
      $(domElement).data("i18nwait") || "Please wait"
    );
    this.i18nfilter = this.escapeHTML(
      $(domElement).data("i18nfilter") || "Filter"
    );
    this.i18nall = this.escapeHTML($(domElement).data("i18nall") || "All");
    this.i18nnofilter = this.escapeHTML(
      $(domElement).data("i18nnofilter") || "None"
    );
    /*create DOM elements only when not already initialized */
    $(domElement).append(
      "<div class='niceCountryInputMenu'><span><a><img class='niceCountryInputMenuCountryFlag' src='' /></a></span><div class='niceCountryInputMenuDropdown'><span style='font-size: 10px;'>▼</span></div></div></div>"
    );
    $(domElement).append(
      "<div class='niceCountryInputMenuFilter' style='display: none;'><input placeholder='Search For Country' class='change' style='outline: 0;border-width: 0 0 0px;'/></div>"
    );
    $(domElement).append(
      "<div class='niceCountryInputMenuDropdownContent' style='display: none;' />"
    );
    $(domElement).append(
      "<input class='niceCountryInputMenuInputHidden' type='hidden'/>"
    );
    /*Data attributes (selectors)*/
    this.defaultText = $(domElement).find(".niceCountryInputMenuDefaultText");
    this.selectOneMenu = $(domElement).find(".niceCountryInputMenu");
    this.selectOneContent = $(domElement).find(
      ".niceCountryInputMenuDropdownContent"
    );
    this.selectOneFilter = $(domElement).find(".niceCountryInputMenuFilter");
    this.selectOneHiddenInput = $(domElement).find(
      ".niceCountryInputMenuInputHidden"
    );
    /*Data attributes (dynamic)*/
    this.selectedCountry = $(domElement).data("selectedcountry");
    this.showSpecialCountries = $(domElement).data("showspecial");
    this.showContinents = $(domElement).data("showContinents");
    this.showContinentsOnly = $(domElement).data("showcontinentsonly");
    this.onlyCountries = eval($(domElement).data("onlycountries"));
    this.showFlags = $(domElement).data("showflags");
    this.onChangeCallback = $(domElement).data("onchangecallback");
    this.preferredCountries = eval($(domElement).data("preferredcountries"));
    /*country data*/
    this.allIsoCountries = [
      { n: "Afghanistan +93", code: "93", code1: "+93", i: "af" },
      { n: "Åland Island +358", code: "358", i: "ax" },
      { n: "Albania +355", code: "355", i: "al" },
      { n: "Algeria +213", code: "213", i: "dz" },
      { n: "American Samoa +1", code: "1", i: "as" },
      { n: "Andorra +376", code: "376", i: "ad" },
      { n: "Angola +244", code: "244", i: "ao" },
      { n: "Anguilla +1", code: "1", i: "ai" },
      { n: "Antigua and Barbuda +1", code: "1", i: "ag" },
      { n: "Argentina +54", code: "54", i: "ar" },
      { n: "Armenia +374", code: "374", i: "am" },
      { n: "Aruba +279", code: "279", i: "aw" },
      { n: "Australia +61", code: "61", i: "au" },
      { n: "Austria +43", code: "43", i: "at" },
      { n: "Azerbaijan +994", code: "994", i: "az" },
      { n: "Bahamas +1", code: "1", i: "bs" },
      { n: "Bahrain +973", code: "973", i: "bh" },
      { n: "Bangladesh (বাংলাদেশ) +880", code: "880", i: "bd" },
      { n: "Barbados +1", code: "1", i: "bb" },
      { n: "Belarus +375", code: "375", i: "by" },
      { n: "Belgium +32", code: "32", i: "be" },
      { n: "Belize +501", code: "501", i: "bz" },
      { n: "Benin +229", code: "229", i: "bj" },
      { n: "Bermuda +1", code: "1", i: "bm" },
      { n: "Bhutan +975", code: "975", i: "bt" },
      { n: "Bolivia +591", code: "591", i: "bo" },
      { n: "Bosnia and Herzegovina +387", code: "387", i: "ba" },
      { n: "Botswana +267", code: "267", i: "bw" },
      { n: "Brazil +55", code: "55", i: "br" },
      { n: "British Indian Ocean Territory +246", code: "246", i: "io" },
      { n: "British Virgin Islands +1", code: "1", i: "vg" },
      { n: "Brunei +673", code: "673", i: "bn" },
      { n: "Bulgaria +359", code: "359", i: "bg" },
      { n: "Burkina Faso +226", code: "226", i: "bf" },
      { n: "Burundi +257", code: "257", i: "bi" },
      { n: "Cambodia +855", code: "855", i: "kh" },
      { n: "Cameroon +237", code: "237", i: "cm" },
      { n: "Canada +1", code: "1", i: "ca" },
      { n: "Cape Verde +238", code: "238", i: "cv" },
      { n: "Caribbean Netherlands +599", code: "599", i: "bq" },
      { n: "Cayman Islands +1", code: "1", i: "ky" },
      { n: "Central African Republic +236", code: "236", i: "cf" },
      { n: "Chad (Tchad) +235", code: "235", i: "td" },
      { n: "Chile +56", code: "56", i: "cl" },
      { n: "China (中国) +86", code: "86", i: "cn" },
      { n: "Christmas Island +61", code: "61", i: "cx" },
      { n: "Cocos (Keeling) Islands  +61", code: "61", i: "cc" },
      { n: "Colombia +57", code: "57", i: "co" },
      { n: "Comoros (‫جزر القمر‬‎) +269", code: "269", i: "km" },
      {
        n: "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo) +243",
        code: "243",
        i: "cd",
      },
      { n: "Congo (Republic) (Congo-Brazzaville) +242", code: "242", i: "cg" },
      { n: "Cook Islands +268", code: "268", i: "ck" },
      { n: "Costa Rica +506", code: "506", i: "cr" },
      { n: "Côte d’Ivoire +225", code: "225", i: "ci" },
      { n: "Croatia (Hrvatska) +385", code: "385", i: "hr" },
      { n: "Cuba +53", code: "53", i: "cu" },
      { n: "Curaçao +599", code: "599", i: "cw" },
      { n: "Cyprus (Κύπρος) +357", code: "357", i: "cy" },
      { n: "Czech Republic (Česká republika) +420", code: "420", i: "cz" },
      { n: "Denmark (Danmark) +45", code: "45", i: "dk" },
      { n: "Djibouti +253", code: "253", i: "dj" },
      { n: "Dominica +1", code: "1", i: "dm" },
      { n: "Dominican Republic (República Dominicana) +1", code: "1", i: "do" },
      { n: "Ecuador +593", code: "593", i: "ec" },
      { n: "Egypt (‫مصر‬‎) +20", code: "20", i: "eg" },
      { n: "El Salvador +503", code: "503", i: "sv" },
      { n: "Equatorial Guinea (Guinea Ecuatorial) +240", code: "240", i: "gq" },
      { n: "Eritrea +291", code: "291", i: "er" },
      { n: "Estonia (Eesti) +372", code: "372", i: "ee" },
      { n: "Ethiopia +251", code: "251", i: "et" },
      { n: "Falkland Islands (Islas Malvinas) +500", code: "500", i: "fk" },
      { n: "Faroe Islands (Føroyar) +298", code: "298", i: "fo" },
      { n: "Fiji +679", code: "679", i: "fj" },
      { n: "Finland (Suomi) +358", code: "358", i: "fi" },
      { n: "France +33", code: "33", i: "fr" },
      { n: "French Guiana (Guyane française) +594", code: "594", i: "gf" },
      { n: "French Polynesia (Polynésie française) +689", code: "689", i: "pf" },
      { n: "Gabon +241", code: "241", i: "ga" },
      { n: "Gambia +220", code: "220", i: "gm" },
      { n: "Georgia (საქართველო) +995", code: "995", i: "ge" },
      { n: "Germany (Deutschland) +49", code: "49", i: "de" },
      { n: "Ghana (Gaana) +233", code: "223", i: "gh" },
      { n: "Gibraltar +350", code: "350", i: "gi" },
      { n: "Greece (Ελλάδα) +30", code: "30", i: "gr" },
      { n: "Greenland (Kalaallit Nunaat) +299", code: "299", i: "gl" },
      { n: "Grenada +1", code: "1", i: "gd" },
      { n: "Guadeloupe +590", code: "590", i: "gp" },
      { n: "Guam +1", code: "1", i: "gu" },
      { n: "Guatemala +502", code: "502", i: "gt" },
      { n: "Guernsey +44", code: "44", i: "gg" },
      { n: "Guinea (Guinée) +224", code: "224", i: "gn" },
      { n: "Guinea-Bissau (Guiné Bissau) +245", code: "245", i: "gw" },
      { n: "Guyana +592", code: "592", i: "gy" },
      { n: "Haiti +509", code: "509", i: "ht" },
      { n: "Honduras +504", code: "504", i: "hn" },
      { n: "Hong Kong (香港) +852", code: "852", i: "hk" },
      { n: "Hungary (Magyarország) +36", code: "36", i: "hu" },
      { n: "Iceland (Ísland) +354", code: "354", i: "is" },
      { n: "India (भारत) +91", code: "91", i: "in" },
      { n: "Indonesia +62", code: "62", i: "id" },
      { n: "Iran (‫ایران‬‎) +98", code: "+98", i: "ir" },
      { n: "Iraq (‫العراق‬‎) +964", code: "964", i: "iq" },
      { n: "Ireland +353", code: "353", i: "ie" },
      { n: "Isle of Man +44", code: "44", i: "im" },
      { n: "Israel (‫ישראל‬‎) +972", code: "972", i: "il" },
      { n: "Italy (Italia) +39", code: "39", i: "it" },
      { n: "Jamaica +1", code: "1", i: "jm" },
      { n: "Japan (日本) +81", code: "81", i: "jp" },
      { n: "Jersey +44", code: "44", i: "je" },
      { n: "Jordan (‫الأردن‬‎) +962", code: "962", i: "jo" },
      { n: "Kazakhstan (Казахстан) +7", code: "7", i: "kz" },
      { n: "Kenya +254", code: "254", i: "ke" },
      { n: "Kiribati +686", code: "686", i: "ki" },
      { n: "Kosovo (Kosovë) +383", code: "383", i: "xk" },
      { n: "Kuwait (‫الكويت‬‎) +965", code: "965", i: "kw" },
      { n: "Kyrgyzstan (Кыргызстан) +996", code: "996", i: "kg" },
      { n: "Laos (ລາວ) +856", code: "856", i: "la" },
      { n: "Latvia (Latvija) +371", code: "371", i: "lv" },
      { n: "Lebanon (‫لبنان‬‎) +961", code: "961", i: "lb" },
      { n: "Lesotho +266", code: "266", i: "ls" },
      { n: "Liberia +231", code: "231", i: "lr" },
      { n: "Libya (‫ليبيا‬‎) +218", code: "218", i: "ly" },
      { n: "Liechtenstein +423", code: "423", i: "li" },
      { n: "Lithuania (Lietuva) +370", code: "370", i: "lt" },
      { n: "Luxembourg +352", code: "352", i: "lu" },
      { n: "Macau (澳門) +853", code: "853", i: "mo" },
      { n: "Macedonia (FYROM) (Македонија) +389", code: "389", i: "mk" },
      { n: "Madagascar (Madagasikara) +261", code: "261", i: "mg" },
      { n: "Malawi +265", code: "265", i: "mw" },
      { n: "Malaysia +60", code: "60", i: "my" },
      { n: "Maldives +960", code: "960", i: "mv" },
      { n: "Mali +223", code: "223", i: "ml" },
      { n: "Malta +356", code: "356", i: "mt" },
      { n: "Marshall Islands +692", code: "692", i: "mh" },
      { n: "Martinique +596", code: "596", i: "mq" },
      { n: "Mauritania (‫موريتانيا‬‎) +222", code: "222", i: "mr" },
      { n: "Mauritius (Moris) +230", code: "230", i: "mu" },
      { n: "Mayotte +262", code: "262", i: "yt" },
      { n: "Mexico (México) +52", code: "52", i: "mx" },
      { n: "Micronesia +691", code: "691", i: "fm" },
      { n: "Moldova (Republica Moldova) +373", code: "373", i: "md" },
      { n: "Monaco +377", code: "377", i: "mc" },
      { n: "Mongolia (Монгол) 976", code: "976", i: "mn" },
      { n: "Montenegro (Crna Gora) +382", code: "382", i: "me" },
      { n: "Montserrat +1", code: "1", i: "ms" },
      { n: "Morocco (‫المغرب‬‎) +212", code: "212", i: "ma" },
      { n: "Mozambique (Moçambique) +258", code: "258", i: "mz" },
      { n: "Myanmar (Burma) (မြန်မာ) +95", code: "95", i: "mm" },
      { n: "Namibia (Namibië) +264", code: "264", i: "na" },
      { n: "Nauru +674", code: "674", i: "nr" },
      { n: "Nepal (नेपाल) +977", code: "977", i: "np" },
      { n: "Netherlands (Nederland) +31", code: "31", i: "nl" },
      { n: "New Caledonia (Nouvelle-Calédonie) +687", code: "687", i: "nc" },
      { n: "New Zealand +64", code: "64", i: "nz" },
      { n: "Nicaragua +505", code: "505", i: "ni" },
      { n: "Niger (Nijar) +227", code: "227", i: "ne" },
      { n: "Nigeria +234", code: "234", i: "ng" },
      { n: "Niue +683", code: "683", i: "nu" },
      { n: "Norfolk Island +672", code: "672", i: "nf" },
      { n: "North Korea (조선 민주주의 인민 공화국) +850", code: "850", i: "kp" },
      { n: "Northern Mariana Islands +1", code: "1", i: "mp" },
      { n: "Norway (Norge) +47", code: "47", i: "no" },
      { n: "Oman (‫عُمان‬‎) +968", code: "968", i: "om" },
      { n: "Pakistan (‫پاکستان‬‎) +92", code: "92", i: "pk" },
      { n: "Palau +680", code: "680", i: "pw" },
      { n: "Palestine (‫فلسطين‬‎) +970", code: "970", i: "ps" },
      { n: "Panama (Panamá) +507", code: "507", i: "pa" },
      { n: "Papua New Guinea +675", code: "675", i: "pg" },
      { n: "Paraguay +595", code: "595", i: "py" },
      { n: "Peru (Perú) +51", code: "51", i: "pe" },
      { n: "Philippines +63", code: "63", i: "ph" },
      { n: "Pitcairn Islands +64", code: "64", i: "pn" },
      { n: "Poland (Polska) +48", code: "48", i: "pl" },
      { n: "Portugal +351", code: "351", i: "pt" },
      { n: "Puerto Rico +1", code: "1", i: "pr" },
      { n: "Qatar (‫قطر‬‎) +974", code: "974", i: "qa" },
      { n: "Réunion (La Réunion) +262", code: "262", i: "re" },
      { n: "Romania (România) +40", code: "40", i: "ro" },
      { n: "Russia (Россия) +7", code: "7", i: "ru" },
      { n: "Rwanda +250", code: "250", i: "rw" },
      { n: "Saint Barthélemy +590", code: "590", i: "bl" },
      { n: "Saint Helena +290", code: "290", i: "sh" },
      { n: "Saint Kitts and Nevis +1", code: "1", i: "kn" },
      { n: "Saint Lucia +1", code: "1", i: "lc" },
      {
        n: "Saint Martin (Saint-Martin (partie française)) +590",
        code: "590",
        i: "mf",
      },
      {
        n: "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon) +508",
        code: "508",
        i: "pm",
      },
      { n: "Saint Vincent and the Grenadines +1", code: "1", i: "vc" },
      { n: "Samoa +685", code: "685", i: "ws" },
      { n: "San Marino +378", code: "378", i: "sm" },
      {
        n: "São Tomé and Príncipe (São Tomé e Príncipe) +239",
        code: "239",
        i: "st",
      },
      {
        n: "Saudi Arabia (‫المملكة العربية السعودية‬‎) +966",
        code: "966",
        i: "sa",
      },
      { n: "Senegal (Sénégal) +221", code: "221", i: "sn" },
      { n: "Serbia (Србија) +381", code: "381", i: "rs" },
      { n: "Seychelles +248", code: "248", i: "sc" },
      { n: "Sierra Leone +232", code: "232", i: "sl" },
      { n: "Singapore +65", code: "65", i: "sg" },
      { n: "Sint Maarten +1", code: "1", i: "sx" },
      { n: "Slovakia (Slovensko) +421", code: "421", i: "sk" },
      { n: "Slovenia (Slovenija) +386", code: "386", i: "si" },
      { n: "Solomon Islands +677", code: "677", i: "sb" },
      { n: "Somalia (Soomaaliya) +252", code: "252", i: "so" },
      { n: "South Africa +27", code: "27", i: "za" },
      { n: "South Georgia & South Sandwich Islands +500", code: "500", i: "gs" },
      { n: "South Korea (대한민국) +82", code: "82", i: "kr" },
      { n: "South Sudan (‫جنوب السودان‬‎) +211", code: "211", i: "ss" },
      { n: "Spain (España) +34", code: "34", i: "es" },
      { n: "Sri Lanka (ශ්‍රී ලංකාව) +94", code: "94", i: "lk" },
      { n: "Sudan (‫السودان‬‎) +249", code: "249", i: "sd" },
      { n: "Suriname +597", code: "567", i: "sr" },
      {
        n: "Svalbard and Jan Mayen (Svalbard og Jan Mayen) +47",
        code: "47",
        i: "sj",
      },
      { n: "Swaziland +268", code: "268", i: "sz" },
      { n: "Sweden (Sverige) +46", code: "46", i: "se" },
      { n: "Switzerland (Schweiz) +41", code: "41", i: "ch" },
      { n: "Syria (‫سوريا‬‎) +963", code: "963", i: "sy" },
      { n: "Taiwan (台灣) +886", i: "tw" },
      { n: "Tajikistan +992", code: "992", i: "tj" },
      { n: "Tanzania +255", code: "255", i: "tz" },
      { n: "Thailand (ไทย) +66", code: "66", i: "th" },
      { n: "Timor-Leste +670", code: "670", i: "tl" },
      { n: "Togo +228", code: "228", i: "tg" },
      { n: "Tokelau +690", code: "690", i: "tk" },
      { n: "Tonga +676", code: "676", i: "to" },
      { n: "Trinidad and Tobago +1", code: "1", i: "tt" },
      { n: "Tunisia (‫تونس‬‎) +216", code: "216", i: "tn" },
      { n: "Turkey (Türkiye) +90", code: "90", i: "tr" },
      { n: "Turkmenistan +993", code: "993", i: "tm" },
      { n: "Turks and Caicos Islands +1", code: "1", i: "tc" },
      { n: "Tuvalu +688", code: "688", i: "tv" },
      { n: "Uganda +256", code: "256", i: "ug" },
      { n: "Ukraine (Україна) +380", code: "380", i: "ua" },
      {
        n: "United Arab Emirates (‫الإمارات العربية المتحدة‬‎) +971",
        code: "971",
        i: "ae",
      },
      { n: "United Kingdom +44", code: "44", i: "gb" },
      { n: "United States +1", code: "1", i: "us" },
      { n: "U.S. Minor Outlying Islands +246", code: "246", i: "um" },
      { n: "U.S. Virgin Islands +1", code: "1", i: "vi" },
      { n: "Uruguay +598", code: "598", i: "uy" },
      { n: "Uzbekistan (Oʻzbekiston) +998", code: "998", i: "uz" },
      { n: "Vanuatu +678", code: "678", i: "vu" },
      { n: "Vatican City (Città del Vaticano) +39", code: "39", i: "va" },
      { n: "Venezuela +58", code: "58", i: "ve" },
      { n: "Vietnam (Việt Nam) +84", code: "84", i: "vn" },
      { n: "Wallis and Futuna +681", code: "681", i: "wf" },
      { n: "Western Sahara (‫الصحراء الغربية‬‎) +212", code: "212", i: "eh" },
      { n: "Yemen (‫اليمن‬‎) +967", code: "967", i: "ye" },
      { n: "Zambia +260", code: "260", i: "zm" },
      { n: "Zimbabwe +263", code: "263", i: "zw" },
    ];
  
    this.specialCountries = [
      { n: this.i18nall, i: "_al" },
      { n: this.i18nnofilter, i: "_nf" },
    ];
    this.continents = [
      { n: "Europe", i: "_eu" },
      { n: "World", i: "_wo" },
      { n: "Africa", i: "_af" },
      { n: "Asia", i: "_as" },
      { n: "North America", i: "_na" },
      { n: "South America", i: "_sa" },
      { n: "Australia and Oceania", i: "_oc" },
      { n: "Antarctis", i: "_an" },
    ];
    this.defaultPreferred = [
      "de",
      "at",
      "ch",
      "fr",
      "it",
      "us",
      "gb",
      "es",
      "ru",
      "jp",
      "cn",
      "kr",
      "tr",
      "hr",
      "br",
    ];
  }
  
  NiceCountryInput.prototype.log = function (value) {
    //console.log("NiceCountryInput | " + value);
  };
  
  NiceCountryInput.prototype.init = function () {
    var _this = this;
    _this.log("init");
  
    //initialized
    if ($(_this.domElement).data("initialized")) {
      _this.log("Already initialized...");
      return;
    }
  
    //bind handlers
    _this.selectOneMenu.click(function () {
      _this.log("selectOneMenu.click");
      _this.openSelection();
    });
    $("body").on("click", function (e) {
      var divname = $(".niceCountryInputSelector");
      if (!divname.is(e.target) && divname.has(e.target).length === 0) {
        $(".niceCountryInputMenuFilter").hide();
        $(".niceCountryInputMenuDropdownContent").hide();
      }
    });
  
    _this.selectOneFilter.find("input").keydown(function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        return false;
      }
    });
    _this.selectOneFilter.find("input").keyup(function (event) {
      if (event.keyCode === 13) {
        _this.selectByFilterReturn();
        event.preventDefault();
        return false;
      }
      _this.filterCountries(this);
    });
  
    _this.updateSelectedCountry();
  
    /*Init country list*/
  
    var countryIterationFunc = function (index, el) {
      //check only country list
      if (
        _this.onlyCountries !== undefined &&
        $.inArray(el.i, _this.onlyCountries) === -1
      ) {
        return;
      }
      //srikanth start and end edit below line
      _this.selectOneContent.append(
        "<a title='" +
          el.n +
          "' data-countryname='" +
          el.n +
          "' data-countryiso='" +
          el.i +
          "' data-code='" +
          el.code +
          "'>" +
          _this.getFlagHtml(el.i.toUpperCase()) +
          "<span style='padding-left:5px;'>" +
          el.n +
          "</span></a>"
      );
      //bind on click handler to appended element
      _this.selectOneContent
        .children()
        .last()
        .click(function () {
          _this.selectCountry(this);
        });
  
      //country selection
      var countryText =
        "<a>" +
        _this.getFlagHtml(el.i.toUpperCase()) +
        "<span>" +
        el.n +
        "</span></a>";
      if (
        _this.selectedCountry !== undefined &&
        _this.selectedCountry.toLowerCase() === el.i
      ) {
        _this.defaultText.text("");
        _this.defaultText.append(countryText);
      }
      //set first country
      if (_this.selectedCountry === undefined && index === 0) {
        _this.defaultText.text("");
        _this.defaultText.append(countryText);
      }
    };
  
    if (_this.showSpecialCountries) {
      $(this.specialCountries).each(countryIterationFunc);
    }
    if (_this.showContinents || _this.showContinentsOnly) {
      $(this.continents).each(countryIterationFunc);
    }
  
    if (!_this.showContinentsOnly) {
      $(this.allIsoCountries).each(countryIterationFunc);
    }
  
    _this.getFlagJSON();
  
    //set as initialized
    _this.log("Initialized...!");
    $(_this.domElement).data("initialized", "true");
  };
  
  NiceCountryInput.prototype.getCountryNameForIso = function (iso) {
    this.log("getCountryNameForIso");
    var cname = "";
    $(this.allIsoCountries).each(function () {
      if (this.i === iso.toLowerCase()) {
        cname = this.n;
      }
    });
    $(this.specialCountries).each(function () {
      if (this.i === iso.toLowerCase()) {
        cname = this.n;
      }
    });
    this.log("return:" + cname);
    return cname;
  };
  
  NiceCountryInput.prototype.getFlagHtml = function (iso) {
    if (this.showFlags !== false) {
      return (
        "<img class='niceCountryInputMenuCountryFlag' data-flagiso='" +
        iso +
        "'/>"
      );
    } else {
      return (
        "<div class='niceCountryInputMenuCountryNoFlag'>" +
        iso.toUpperCase() +
        "</div>"
      );
    }
  };
  
  NiceCountryInput.prototype.getFlagJSON = function () {
    var _this = this;
    $(".niceCountryInputMenuCountryFlag").each(function (i, d) {
      var iso = $(d).data("flagiso");
      $(d).attr(
        "src",
        "data:image/png;base64," +
          NiceCountryInput.niceCountryFlags[iso.toLowerCase()]
      );
    });
  };
  
  NiceCountryInput.prototype.openSelection = function (event) {
    //event.stopPropagation();
    this.selectOneContent.toggle();
    this.selectOneFilter.toggle();
    $("niceCountryInputSelector").toggleClass("open");
    this.selectOneFilter.find("input").focus();
  };
  
  NiceCountryInput.prototype.updateSelectedCountry = function () {
    this.log("updateSelectedCountry");
    var countryiso = this.selectedCountry;
    var countryname = this.getCountryNameForIso(countryiso);
    this.selectOneMenu.find("a").first().text("");
    this.selectOneMenu
      .find("a")
      .first()
      .append("<a>" + this.getFlagHtml(countryiso.toUpperCase()) + "</a>");
    //reload flags
    this.getFlagJSON();
  };
  
  NiceCountryInput.prototype.selectCountry = function (e) {
    this.log("selectCountry");
    var countryname = $(e).data("countryname");
    var countryiso = $(e).data("countryiso");
    var contrycode = $(e).data("code");
    //srikanth start
    $("#phone").val("");
    $("#phone").val("+" + contrycode);
    // $('#phone').focus();
    //srikanth end
    //Select the country
    this.selectOneMenu.find("a").first().text("");
    this.selectOneMenu
      .find("a")
      .first()
      .append("<a>" + this.getFlagHtml(countryiso.toUpperCase()) + "</a>");
    //hide the country list panel and the filter
    this.selectOneContent.hide();
    this.selectOneFilter.hide();
    //set the hidden input
    this.selectOneHiddenInput.val(countryiso.toUpperCase());
    if (this.onChangeCallback !== undefined && this.onChangeCallback !== "") {
      //  window[this.onChangeCallback](countryiso.toUpperCase());
    }
    //reload flags
    this.getFlagJSON();
  };
  
  NiceCountryInput.prototype.selectByFilterReturn = function () {
    var allAnchors = this.selectOneContent.children("a");
    var firstVisible;
    allAnchors.each(function () {
      if ($(this).is(":visible")) {
        firstVisible = this;
        return false;
      }
    });
    if (firstVisible !== undefined) {
      this.selectCountry(firstVisible);
    }
  };
  
  NiceCountryInput.prototype.filterCountries = function (elem) {
    this.log("filterCountries");
    var filterVal = $(elem).val().toLowerCase();
    var allAnchors = this.selectOneContent.children("a");
    allAnchors.each(function () {
      if ($(this).data("countryname").toLowerCase().indexOf(filterVal) !== -1) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  };
  
  NiceCountryInput.prototype.escapeHTML = function (str) {
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;",
    };
    return String(str).replace(/[&<>"'`=\/]/g, function (s) {
      return entityMap[s];
    });
  };
  //srikanth start
  var allIsoCountries1 = [
    { n: "Afghanistan +93", code: "93", code1: "+93", i: "af" },
    { n: "Åland Island +358", code: "358", i: "ax" },
    { n: "Albania +355", code: "355", i: "al" },
    { n: "Algeria +213", code: "213", i: "dz" },
    { n: "American Samoa +1", code: "1", i: "as" },
    { n: "Andorra +376", code: "376", i: "ad" },
    { n: "Angola +244", code: "244", i: "ao" },
    { n: "Anguilla +1", code: "1", i: "ai" },
    { n: "Antigua and Barbuda +1", code: "1", i: "ag" },
    { n: "Argentina +54", code: "54", i: "ar" },
    { n: "Armenia +374", code: "374", i: "am" },
    { n: "Aruba +279", code: "279", i: "aw" },
    { n: "Australia +61", code: "61", i: "au" },
    { n: "Austria +43", code: "43", i: "at" },
    { n: "Azerbaijan +994", code: "994", i: "az" },
    { n: "Bahamas +1", code: "1", i: "bs" },
    { n: "Bahrain +973", code: "973", i: "bh" },
    { n: "Bangladesh (বাংলাদেশ) +880", code: "880", i: "bd" },
    { n: "Barbados +1", code: "1", i: "bb" },
    { n: "Belarus +375", code: "375", i: "by" },
    { n: "Belgium +32", code: "32", i: "be" },
    { n: "Belize +501", code: "501", i: "bz" },
    { n: "Benin +229", code: "229", i: "bj" },
    { n: "Bermuda +1", code: "1", i: "bm" },
    { n: "Bhutan +975", code: "975", i: "bt" },
    { n: "Bolivia +591", code: "591", i: "bo" },
    { n: "Bosnia and Herzegovina +387", code: "387", i: "ba" },
    { n: "Botswana +267", code: "267", i: "bw" },
    { n: "Brazil +55", code: "55", i: "br" },
    { n: "British Indian Ocean Territory +246", code: "246", i: "io" },
    { n: "British Virgin Islands +1", code: "1", i: "vg" },
    { n: "Brunei +673", code: "673", i: "bn" },
    { n: "Bulgaria +359", code: "359", i: "bg" },
    { n: "Burkina Faso +226", code: "226", i: "bf" },
    { n: "Burundi +257", code: "257", i: "bi" },
    { n: "Cambodia +855", code: "855", i: "kh" },
    { n: "Cameroon +237", code: "237", i: "cm" },
    { n: "Canada +1", code: "1", i: "ca" },
    { n: "Cape Verde +238", code: "238", i: "cv" },
    { n: "Caribbean Netherlands +599", code: "599", i: "bq" },
    { n: "Cayman Islands +1", code: "1", i: "ky" },
    { n: "Central African Republic +236", code: "236", i: "cf" },
    { n: "Chad (Tchad) +235", code: "235", i: "td" },
    { n: "Chile +56", code: "56", i: "cl" },
    { n: "China (中国) +86", code: "86", i: "cn" },
    { n: "Christmas Island +61", code: "61", i: "cx" },
    { n: "Cocos (Keeling) Islands  +61", code: "61", i: "cc" },
    { n: "Colombia +57", code: "57", i: "co" },
    { n: "Comoros (‫جزر القمر‬‎) +269", code: "269", i: "km" },
    {
      n: "Congo (DRC) (Jamhuri ya Kidemokrasia ya Kongo) +243",
      code: "243",
      i: "cd",
    },
    { n: "Congo (Republic) (Congo-Brazzaville) +242", code: "242", i: "cg" },
    { n: "Cook Islands +268", code: "268", i: "ck" },
    { n: "Costa Rica +506", code: "506", i: "cr" },
    { n: "Côte d’Ivoire +225", code: "225", i: "ci" },
    { n: "Croatia (Hrvatska) +385", code: "385", i: "hr" },
    { n: "Cuba +53", code: "53", i: "cu" },
    { n: "Curaçao +599", code: "599", i: "cw" },
    { n: "Cyprus (Κύπρος) +357", code: "357", i: "cy" },
    { n: "Czech Republic (Česká republika) +420", code: "420", i: "cz" },
    { n: "Denmark (Danmark) +45", code: "45", i: "dk" },
    { n: "Djibouti +253", code: "253", i: "dj" },
    { n: "Dominica +1", code: "1", i: "dm" },
    { n: "Dominican Republic (República Dominicana) +1", code: "1", i: "do" },
    { n: "Ecuador +593", code: "593", i: "ec" },
    { n: "Egypt (‫مصر‬‎) +20", code: "20", i: "eg" },
    { n: "El Salvador +503", code: "503", i: "sv" },
    { n: "Equatorial Guinea (Guinea Ecuatorial) +240", code: "240", i: "gq" },
    { n: "Eritrea +291", code: "291", i: "er" },
    { n: "Estonia (Eesti) +372", code: "372", i: "ee" },
    { n: "Ethiopia +251", code: "251", i: "et" },
    { n: "Falkland Islands (Islas Malvinas) +500", code: "500", i: "fk" },
    { n: "Faroe Islands (Føroyar) +298", code: "298", i: "fo" },
    { n: "Fiji +679", code: "679", i: "fj" },
    { n: "Finland (Suomi) +358", code: "358", i: "fi" },
    { n: "France +33", code: "33", i: "fr" },
    { n: "French Guiana (Guyane française) +594", code: "594", i: "gf" },
    { n: "French Polynesia (Polynésie française) +689", code: "689", i: "pf" },
    { n: "Gabon +241", code: "241", i: "ga" },
    { n: "Gambia +220", code: "220", i: "gm" },
    { n: "Georgia (საქართველო) +995", code: "995", i: "ge" },
    { n: "Germany (Deutschland) +49", code: "49", i: "de" },
    { n: "Ghana (Gaana) +233", code: "223", i: "gh" },
    { n: "Gibraltar +350", code: "350", i: "gi" },
    { n: "Greece (Ελλάδα) +30", code: "30", i: "gr" },
    { n: "Greenland (Kalaallit Nunaat) +299", code: "299", i: "gl" },
    { n: "Grenada +1", code: "1", i: "gd" },
    { n: "Guadeloupe +590", code: "590", i: "gp" },
    { n: "Guam +1", code: "1", i: "gu" },
    { n: "Guatemala +502", code: "502", i: "gt" },
    { n: "Guernsey +44", code: "44", i: "gg" },
    { n: "Guinea (Guinée) +224", code: "224", i: "gn" },
    { n: "Guinea-Bissau (Guiné Bissau) +245", code: "245", i: "gw" },
    { n: "Guyana +592", code: "592", i: "gy" },
    { n: "Haiti +509", code: "509", i: "ht" },
    { n: "Honduras +504", code: "504", i: "hn" },
    { n: "Hong Kong (香港) +852", code: "852", i: "hk" },
    { n: "Hungary (Magyarország) +36", code: "36", i: "hu" },
    { n: "Iceland (Ísland) +354", code: "354", i: "is" },
    { n: "India (भारत) +91", code: "91", i: "in" },
    { n: "Indonesia +62", code: "62", i: "id" },
    { n: "Iran (‫ایران‬‎) +98", code: "+98", i: "ir" },
    { n: "Iraq (‫العراق‬‎) +964", code: "964", i: "iq" },
    { n: "Ireland +353", code: "353", i: "ie" },
    { n: "Isle of Man +44", code: "44", i: "im" },
    { n: "Israel (‫ישראל‬‎) +972", code: "972", i: "il" },
    { n: "Italy (Italia) +39", code: "39", i: "it" },
    { n: "Jamaica +1", code: "1", i: "jm" },
    { n: "Japan (日本) +81", code: "81", i: "jp" },
    { n: "Jersey +44", code: "44", i: "je" },
    { n: "Jordan (‫الأردن‬‎) +962", code: "962", i: "jo" },
    { n: "Kazakhstan (Казахстан) +7", code: "7", i: "kz" },
    { n: "Kenya +254", code: "254", i: "ke" },
    { n: "Kiribati +686", code: "686", i: "ki" },
    { n: "Kosovo (Kosovë) +383", code: "383", i: "xk" },
    { n: "Kuwait (‫الكويت‬‎) +965", code: "965", i: "kw" },
    { n: "Kyrgyzstan (Кыргызстан) +996", code: "996", i: "kg" },
    { n: "Laos (ລາວ) +856", code: "856", i: "la" },
    { n: "Latvia (Latvija) +371", code: "371", i: "lv" },
    { n: "Lebanon (‫لبنان‬‎) +961", code: "961", i: "lb" },
    { n: "Lesotho +266", code: "266", i: "ls" },
    { n: "Liberia +231", code: "231", i: "lr" },
    { n: "Libya (‫ليبيا‬‎) +218", code: "218", i: "ly" },
    { n: "Liechtenstein +423", code: "423", i: "li" },
    { n: "Lithuania (Lietuva) +370", code: "370", i: "lt" },
    { n: "Luxembourg +352", code: "352", i: "lu" },
    { n: "Macau (澳門) +853", code: "853", i: "mo" },
    { n: "Macedonia (FYROM) (Македонија) +389", code: "389", i: "mk" },
    { n: "Madagascar (Madagasikara) +261", code: "261", i: "mg" },
    { n: "Malawi +265", code: "265", i: "mw" },
    { n: "Malaysia +60", code: "60", i: "my" },
    { n: "Maldives +960", code: "960", i: "mv" },
    { n: "Mali +223", code: "223", i: "ml" },
    { n: "Malta +356", code: "356", i: "mt" },
    { n: "Marshall Islands +692", code: "692", i: "mh" },
    { n: "Martinique +596", code: "596", i: "mq" },
    { n: "Mauritania (‫موريتانيا‬‎) +222", code: "222", i: "mr" },
    { n: "Mauritius (Moris) +230", code: "230", i: "mu" },
    { n: "Mayotte +262", code: "262", i: "yt" },
    { n: "Mexico (México) +52", code: "52", i: "mx" },
    { n: "Micronesia +691", code: "691", i: "fm" },
    { n: "Moldova (Republica Moldova) +373", code: "373", i: "md" },
    { n: "Monaco +377", code: "377", i: "mc" },
    { n: "Mongolia (Монгол) 976", code: "976", i: "mn" },
    { n: "Montenegro (Crna Gora) +382", code: "382", i: "me" },
    { n: "Montserrat +1", code: "1", i: "ms" },
    { n: "Morocco (‫المغرب‬‎) +212", code: "212", i: "ma" },
    { n: "Mozambique (Moçambique) +258", code: "258", i: "mz" },
    { n: "Myanmar (Burma) (မြန်မာ) +95", code: "95", i: "mm" },
    { n: "Namibia (Namibië) +264", code: "264", i: "na" },
    { n: "Nauru +674", code: "674", i: "nr" },
    { n: "Nepal (नेपाल) +977", code: "977", i: "np" },
    { n: "Netherlands (Nederland) +31", code: "31", i: "nl" },
    { n: "New Caledonia (Nouvelle-Calédonie) +687", code: "687", i: "nc" },
    { n: "New Zealand +64", code: "64", i: "nz" },
    { n: "Nicaragua +505", code: "505", i: "ni" },
    { n: "Niger (Nijar) +227", code: "227", i: "ne" },
    { n: "Nigeria +234", code: "234", i: "ng" },
    { n: "Niue +683", code: "683", i: "nu" },
    { n: "Norfolk Island +672", code: "672", i: "nf" },
    { n: "North Korea (조선 민주주의 인민 공화국) +850", code: "850", i: "kp" },
    { n: "Northern Mariana Islands +1", code: "1", i: "mp" },
    { n: "Norway (Norge) +47", code: "47", i: "no" },
    { n: "Oman (‫عُمان‬‎) +968", code: "968", i: "om" },
    { n: "Pakistan (‫پاکستان‬‎) +92", code: "92", i: "pk" },
    { n: "Palau +680", code: "680", i: "pw" },
    { n: "Palestine (‫فلسطين‬‎) +970", code: "970", i: "ps" },
    { n: "Panama (Panamá) +507", code: "507", i: "pa" },
    { n: "Papua New Guinea +675", code: "675", i: "pg" },
    { n: "Paraguay +595", code: "595", i: "py" },
    { n: "Peru (Perú) +51", code: "51", i: "pe" },
    { n: "Philippines +63", code: "63", i: "ph" },
    { n: "Pitcairn Islands +64", code: "64", i: "pn" },
    { n: "Poland (Polska) +48", code: "48", i: "pl" },
    { n: "Portugal +351", code: "351", i: "pt" },
    { n: "Puerto Rico +1", code: "1", i: "pr" },
    { n: "Qatar (‫قطر‬‎) +974", code: "974", i: "qa" },
    { n: "Réunion (La Réunion) +262", code: "262", i: "re" },
    { n: "Romania (România) +40", code: "40", i: "ro" },
    { n: "Russia (Россия) +7", code: "7", i: "ru" },
    { n: "Rwanda +250", code: "250", i: "rw" },
    { n: "Saint Barthélemy +590", code: "590", i: "bl" },
    { n: "Saint Helena +290", code: "290", i: "sh" },
    { n: "Saint Kitts and Nevis +1", code: "1", i: "kn" },
    { n: "Saint Lucia +1", code: "1", i: "lc" },
    {
      n: "Saint Martin (Saint-Martin (partie française)) +590",
      code: "590",
      i: "mf",
    },
    {
      n: "Saint Pierre and Miquelon (Saint-Pierre-et-Miquelon) +508",
      code: "508",
      i: "pm",
    },
    { n: "Saint Vincent and the Grenadines +1", code: "1", i: "vc" },
    { n: "Samoa +685", code: "685", i: "ws" },
    { n: "San Marino +378", code: "378", i: "sm" },
    {
      n: "São Tomé and Príncipe (São Tomé e Príncipe) +239",
      code: "239",
      i: "st",
    },
    {
      n: "Saudi Arabia (‫المملكة العربية السعودية‬‎) +966",
      code: "966",
      i: "sa",
    },
    { n: "Senegal (Sénégal) +221", code: "221", i: "sn" },
    { n: "Serbia (Србија) +381", code: "381", i: "rs" },
    { n: "Seychelles +248", code: "248", i: "sc" },
    { n: "Sierra Leone +232", code: "232", i: "sl" },
    { n: "Singapore +65", code: "65", i: "sg" },
    { n: "Sint Maarten +1", code: "1", i: "sx" },
    { n: "Slovakia (Slovensko) +421", code: "421", i: "sk" },
    { n: "Slovenia (Slovenija) +386", code: "386", i: "si" },
    { n: "Solomon Islands +677", code: "677", i: "sb" },
    { n: "Somalia (Soomaaliya) +252", code: "252", i: "so" },
    { n: "South Africa +27", code: "27", i: "za" },
    { n: "South Georgia & South Sandwich Islands +500", code: "500", i: "gs" },
    { n: "South Korea (대한민국) +82", code: "82", i: "kr" },
    { n: "South Sudan (‫جنوب السودان‬‎) +211", code: "211", i: "ss" },
    { n: "Spain (España) +34", code: "34", i: "es" },
    { n: "Sri Lanka (ශ්‍රී ලංකාව) +94", code: "94", i: "lk" },
    { n: "Sudan (‫السودان‬‎) +249", code: "249", i: "sd" },
    { n: "Suriname +597", code: "567", i: "sr" },
    {
      n: "Svalbard and Jan Mayen (Svalbard og Jan Mayen) +47",
      code: "47",
      i: "sj",
    },
    { n: "Swaziland +268", code: "268", i: "sz" },
    { n: "Sweden (Sverige) +46", code: "46", i: "se" },
    { n: "Switzerland (Schweiz) +41", code: "41", i: "ch" },
    { n: "Syria (‫سوريا‬‎) +963", code: "963", i: "sy" },
    { n: "Taiwan (台灣) +886", i: "tw" },
    { n: "Tajikistan +992", code: "992", i: "tj" },
    { n: "Tanzania +255", code: "255", i: "tz" },
    { n: "Thailand (ไทย) +66", code: "66", i: "th" },
    { n: "Timor-Leste +670", code: "670", i: "tl" },
    { n: "Togo +228", code: "228", i: "tg" },
    { n: "Tokelau +690", code: "690", i: "tk" },
    { n: "Tonga +676", code: "676", i: "to" },
    { n: "Trinidad and Tobago +1", code: "1", i: "tt" },
    { n: "Tunisia (‫تونس‬‎) +216", code: "216", i: "tn" },
    { n: "Turkey (Türkiye) +90", code: "90", i: "tr" },
    { n: "Turkmenistan +993", code: "993", i: "tm" },
    { n: "Turks and Caicos Islands +1", code: "1", i: "tc" },
    { n: "Tuvalu +688", code: "688", i: "tv" },
    { n: "Uganda +256", code: "256", i: "ug" },
    { n: "Ukraine (Україна) +380", code: "380", i: "ua" },
    {
      n: "United Arab Emirates (‫الإمارات العربية المتحدة‬‎) +971",
      code: "971",
      i: "ae",
    },
    { n: "United Kingdom +44", code: "44", i: "gb" },
    { n: "U.S. Minor Outlying Islands +246", code: "246", i: "um" },
    { n: "U.S. Virgin Islands +1", code: "1", i: "vi" },
    { n: "Uruguay +598", code: "598", i: "uy" },
    { n: "Uzbekistan (Oʻzbekiston) +998", code: "998", i: "uz" },
    { n: "Vanuatu +678", code: "678", i: "vu" },
    { n: "Vatican City (Città del Vaticano) +39", code: "39", i: "va" },
    { n: "Venezuela +58", code: "58", i: "ve" },
    { n: "Vietnam (Việt Nam) +84", code: "84", i: "vn" },
    { n: "Wallis and Futuna +681", code: "681", i: "wf" },
    { n: "Western Sahara (‫الصحراء الغربية‬‎) +212", code: "212", i: "eh" },
    { n: "Yemen (‫اليمن‬‎) +967", code: "967", i: "ye" },
    { n: "Zambia +260", code: "260", i: "zm" },
    { n: "Zimbabwe +263", code: "263", i: "zw" },
    { n: "United States +1", code: "1", i: "us" },
  ];
  $("#phone").keyup(function () {
    // $("#phone").css("background-color", "red");
    var c = "";
    var demoi = "";
    var democode = "";
    var countrycode = "";
    countrycode = $("#phone").val();
    var datacountrycount = allIsoCountries1.length;
    if (countrycode == "") {
    }
    // else if(countrycode.charAt(0)!="+")
    //  {
  
    //  }
    else {
      if (countrycode[0] == "+") {
        for (var i = 0; i < countrycode.length + 1; i++) {
          c += countrycode[i + 1];
  
          for (var j = 0; j < datacountrycount; j++) {
            if (allIsoCountries1[j].code == c) {
              demoi = allIsoCountries1[j].i;
              democode = allIsoCountries1[j].code;
            }
          }
        }
      }
      var iso = demoi;
      // $(".niceCountryInputMenuCountryFlag").attr("src", "data:image/png;base64," + NiceCountryInput.niceCountryFlags[iso.toLowerCase()])
      //alert(demoi);
      var countryiso = iso;
      //srikanth start
      // $('#phone').val('');
      // $('#phone').val('+'+contrycode);
      //srikanth end
      //Select the country
      $(".niceCountryInputSelector")
        .find(".niceCountryInputMenu")
        .find("a")
        .first()
        .text("");
      if (countryiso == "") {
        iso = "none";
        $(".niceCountryInputSelector")
          .find(".niceCountryInputMenu")
          .find("a")
          .first()
          .append(
            "<a><img class='niceCountryInputMenuCountryFlag' data-flagiso='" +
              iso +
              "'/></a>"
          );
      } else {
        $(".niceCountryInputSelector")
          .find(".niceCountryInputMenu")
          .find("a")
          .first()
          .append(
            "<a><img class='niceCountryInputMenuCountryFlag' data-flagiso='" +
              iso +
              "'/></a>"
          );
      }
      //   if( $(".niceCountryInputSelector").onChangeCallback !== undefined &&  $(".niceCountryInputSelector").onChangeCallback !== ""){
      //     window[ $(".niceCountryInputSelector").onChangeCallback](countryiso.toUpperCase());
      // }
      //reload flags
      $(".niceCountryInputSelector")
        .find(".niceCountryInputMenuCountryFlag")
        .each(function (i, d) {
          var iso = $(d).data("flagiso");
          if (iso == "none") {
            $(d).attr(
              "src",
              "data:image/png;base64,/9j/4AAQSkZJRgABAQEASABIAAD/4QQURXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAAAeAAAAcgEyAAIAAAAUAAAAkIdpAAQAAAABAAAApAAAANAACvyAAAAnEAAK/IAAACcQQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykAMjAxODowOToxOSAxMDowMjozMAAAA6ABAAMAAAAB//8AAKACAAQAAAABAAADIKADAAQAAAABAAADIAAAAAAAAAAGAQMAAwAAAAEABgAAARoABQAAAAEAAAEeARsABQAAAAEAAAEmASgAAwAAAAEAAgAAAgEABAAAAAEAAAEuAgIABAAAAAEAAALdAAAAAAAAAEgAAAABAAAASAAAAAH/2P/bAEMACAYGBwYFCAcHBwkJCAoMFA0MCwsMGRITDxQdGh8eHRocHCAkLicgIiwjHBwoNyksMDE0NDQfJzk9ODI8LjM0Mv/bAEMBCQkJDAsMGA0NGDIhHCEyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMv/AABEIAFAAUAMBIQACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AN2ikIKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKAP/ZAP/tDVRQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAADxwBWgADGyVHHAIAAAIAAAA4QklNBCUAAAAAABDNz/p9qMe+CQVwdq6vBcNOOEJJTQQ6AAAAAADlAAAAEAAAAAEAAAAAAAtwcmludE91dHB1dAAAAAUAAAAAUHN0U2Jvb2wBAAAAAEludGVlbnVtAAAAAEludGUAAAAAQ2xybQAAAA9wcmludFNpeHRlZW5CaXRib29sAAAAAAtwcmludGVyTmFtZVRFWFQAAAABAAAAAAAPcHJpbnRQcm9vZlNldHVwT2JqYwAAAAwAUAByAG8AbwBmACAAUwBlAHQAdQBwAAAAAAAKcHJvb2ZTZXR1cAAAAAEAAAAAQmx0bmVudW0AAAAMYnVpbHRpblByb29mAAAACXByb29mQ01ZSwA4QklNBDsAAAAAAi0AAAAQAAAAAQAAAAAAEnByaW50T3V0cHV0T3B0aW9ucwAAABcAAAAAQ3B0bmJvb2wAAAAAAENsYnJib29sAAAAAABSZ3NNYm9vbAAAAAAAQ3JuQ2Jvb2wAAAAAAENudENib29sAAAAAABMYmxzYm9vbAAAAAAATmd0dmJvb2wAAAAAAEVtbERib29sAAAAAABJbnRyYm9vbAAAAAAAQmNrZ09iamMAAAABAAAAAAAAUkdCQwAAAAMAAAAAUmQgIGRvdWJAb+AAAAAAAAAAAABHcm4gZG91YkBv4AAAAAAAAAAAAEJsICBkb3ViQG/gAAAAAAAAAAAAQnJkVFVudEYjUmx0AAAAAAAAAAAAAAAAQmxkIFVudEYjUmx0AAAAAAAAAAAAAAAAUnNsdFVudEYjUHhsQFIAAAAAAAAAAAAKdmVjdG9yRGF0YWJvb2wBAAAAAFBnUHNlbnVtAAAAAFBnUHMAAAAAUGdQQwAAAABMZWZ0VW50RiNSbHQAAAAAAAAAAAAAAABUb3AgVW50RiNSbHQAAAAAAAAAAAAAAABTY2wgVW50RiNQcmNAWQAAAAAAAAAAABBjcm9wV2hlblByaW50aW5nYm9vbAAAAAAOY3JvcFJlY3RCb3R0b21sb25nAAAAAAAAAAxjcm9wUmVjdExlZnRsb25nAAAAAAAAAA1jcm9wUmVjdFJpZ2h0bG9uZwAAAAAAAAALY3JvcFJlY3RUb3Bsb25nAAAAAAA4QklNA+0AAAAAABAASAAAAAEAAgBIAAAAAQACOEJJTQQmAAAAAAAOAAAAAAAAAAAAAD+AAAA4QklNA/IAAAAAAAoAAP///////wAAOEJJTQQNAAAAAAAEAAAAeDhCSU0EGQAAAAAABAAAAB44QklNA/MAAAAAAAkAAAAAAAAAAAEAOEJJTScQAAAAAAAKAAEAAAAAAAAAAjhCSU0D9QAAAAAASAAvZmYAAQBsZmYABgAAAAAAAQAvZmYAAQChmZoABgAAAAAAAQAyAAAAAQBaAAAABgAAAAAAAQA1AAAAAQAtAAAABgAAAAAAAThCSU0D+AAAAAAAcAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAA4QklNBAAAAAAAAAIAADhCSU0EAgAAAAAAAgAAOEJJTQQwAAAAAAABAQA4QklNBC0AAAAAAAYAAQAAAAM4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADSwAAAAYAAAAAAAAAAAAAAyAAAAMgAAAACwBNAGEAcwB0AGUAcgAgAGYAaQBsAGUAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAyAAAAMgAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAEAAAAAAABudWxsAAAAAgAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAAAFRvcCBsb25nAAAAAAAAAABMZWZ0bG9uZwAAAAAAAAAAQnRvbWxvbmcAAAMgAAAAAFJnaHRsb25nAAADIAAAAAZzbGljZXNWbExzAAAAAU9iamMAAAABAAAAAAAFc2xpY2UAAAASAAAAB3NsaWNlSURsb25nAAAAAAAAAAdncm91cElEbG9uZwAAAAAAAAAGb3JpZ2luZW51bQAAAAxFU2xpY2VPcmlnaW4AAAANYXV0b0dlbmVyYXRlZAAAAABUeXBlZW51bQAAAApFU2xpY2VUeXBlAAAAAEltZyAAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAADIAAAAABSZ2h0bG9uZwAAAyAAAAADdXJsVEVYVAAAAAEAAAAAAABudWxsVEVYVAAAAAEAAAAAAABNc2dlVEVYVAAAAAEAAAAAAAZhbHRUYWdURVhUAAAAAQAAAAAADmNlbGxUZXh0SXNIVE1MYm9vbAEAAAAIY2VsbFRleHRURVhUAAAAAQAAAAAACWhvcnpBbGlnbmVudW0AAAAPRVNsaWNlSG9yekFsaWduAAAAB2RlZmF1bHQAAAAJdmVydEFsaWduZW51bQAAAA9FU2xpY2VWZXJ0QWxpZ24AAAAHZGVmYXVsdAAAAAtiZ0NvbG9yVHlwZWVudW0AAAARRVNsaWNlQkdDb2xvclR5cGUAAAAATm9uZQAAAAl0b3BPdXRzZXRsb25nAAAAAAAAAApsZWZ0T3V0c2V0bG9uZwAAAAAAAAAMYm90dG9tT3V0c2V0bG9uZwAAAAAAAAALcmlnaHRPdXRzZXRsb25nAAAAAAA4QklNBCgAAAAAAAwAAAACP/AAAAAAAAA4QklNBBEAAAAAAAEBADhCSU0EFAAAAAAABAAAAAM4QklNBAwAAAAABAAAAAABAAAAoAAAAKAAAAHgAAEsAAAAA+QAGAAB/9j/7QAMQWRvYmVfQ00AAv/uAA5BZG9iZQBkgAAAAAH/2wCEAAwICAgJCAwJCQwRCwoLERUPDAwPFRgTExUTExgRDAwMDAwMEQwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwBDQsLDQ4NEA4OEBQODg4UFA4ODg4UEQwMDAwMEREMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAKAAoAMBIgACEQEDEQH/3QAEAAr/xAE/AAABBQEBAQEBAQAAAAAAAAADAAECBAUGBwgJCgsBAAEFAQEBAQEBAAAAAAAAAAEAAgMEBQYHCAkKCxAAAQQBAwIEAgUHBggFAwwzAQACEQMEIRIxBUFRYRMicYEyBhSRobFCIyQVUsFiMzRygtFDByWSU/Dh8WNzNRaisoMmRJNUZEXCo3Q2F9JV4mXys4TD03Xj80YnlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vY3R1dnd4eXp7fH1+f3EQACAgECBAQDBAUGBwcGBTUBAAIRAyExEgRBUWFxIhMFMoGRFKGxQiPBUtHwMyRi4XKCkkNTFWNzNPElBhaisoMHJjXC0kSTVKMXZEVVNnRl4vKzhMPTdePzRpSkhbSVxNTk9KW1xdXl9VZmdoaWprbG1ub2JzdHV2d3h5ent8f/2gAMAwEAAhEDEQA/ANNJJJBCkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJT/AP/Q00kkkEKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklP8A/9HTSSSQQpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSU/wD/0tNJJJBCkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJT/AP/T00kkkEKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklP8A/9TTSSSQQpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSU/wD/1dNJJJBCkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJT/AP/W00kkkEKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklP8A/9fTSSSQQpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSU/wD/0NNJJJBCkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJSkkkklKSSSSUpJJJJT/AP/ZOEJJTQQhAAAAAABVAAAAAQEAAAAPAEEAZABvAGIAZQAgAFAAaABvAHQAbwBzAGgAbwBwAAAAEwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAgAEMAUwA2AAAAAQA4QklNBAYAAAAAAAcACAAAAAEBAP/hESVodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+DQoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4NCgkJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAxOC0wOS0xOFQxMzo0OTozMSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOC0wOS0xOVQxMDowMjozMCswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMTgtMDktMTlUMTA6MDI6MzArMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvanBlZyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRUZDQzE4NEVBQkJFODExODRBOUU2NEJGREFEODJGMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDMzNEM0U0OTQxQkJFODExQkNDRDlBQ0E3RjZFMjY0RiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOkMzM0QzRTQ5NDFCQkU4MTFCQ0NEOUFDQTdGNkUyNjRGIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4NCgkJCTx4bXBNTTpIaXN0b3J5Pg0KCQkJCTxyZGY6U2VxPg0KCQkJCQk8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMzNEM0U0OTQxQkJFODExQkNDRDlBQ0E3RjZFMjY0RiIgc3RFdnQ6d2hlbj0iMjAxOC0wOS0xOFQxMzo0OTozMSswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiLz4NCgkJCQkJPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjY5RDUyRDJBRTVCQkU4MTE4NEE5RTY0QkZEQUQ4MkYyIiBzdEV2dDp3aGVuPSIyMDE4LTA5LTE5VDA5OjI0OjIzKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPg0KCQkJCQk8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6M0RGQ0MxODRFQUJCRTgxMTg0QTlFNjRCRkRBRDgyRjIiIHN0RXZ0OndoZW49IjIwMTgtMDktMTlUMTA6MDI6MzArMDE6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+DQoJCQkJCTxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9qcGVnIi8+DQoJCQkJCTxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL2pwZWciLz4NCgkJCQkJPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNFRkNDMTg0RUFCQkU4MTE4NEE5RTY0QkZEQUQ4MkYyIiBzdEV2dDp3aGVuPSIyMDE4LTA5LTE5VDEwOjAyOjMwKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPg0KCQkJCTwvcmRmOlNlcT4NCgkJCTwveG1wTU06SGlzdG9yeT4NCgkJCTx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjNERkNDMTg0RUFCQkU4MTE4NEE5RTY0QkZEQUQ4MkYyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkMzM0QzRTQ5NDFCQkU4MTFCQ0NEOUFDQTdGNkUyNjRGIiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6QzMzRDNFNDk0MUJCRTgxMUJDQ0Q5QUNBN0Y2RTI2NEYiLz4NCgkJPC9yZGY6RGVzY3JpcHRpb24+DQoJPC9yZGY6UkRGPg0KPC94OnhtcG1ldGE+DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwACAQECAQECAgICAgICAgMFAwMDAwMGBAQDBQcGBwcHBgcHCAkLCQgICggHBwoNCgoLDAwMDAcJDg8NDA4LDAwM/9sAQwECAgIDAwMGAwMGDAgHCAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAUABQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A90ooorMzCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z"
            );
            $(d).css("width", "50%");
          } else {
            $(d).attr(
              "src",
              "data:image/png;base64," +
                NiceCountryInput.niceCountryFlags[iso.toLowerCase()]
            );
          }
        });
    }
  });
  //srikanth end
  NiceCountryInput.niceCountryFlags = {
    ab: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA3klEQVR4XmNgGAXUAAvcdN+j4yW+Jh/QxQwaLE8zzLLdTxE+Yaj1H4YvBnr/P21nDqYvRQTBxUHYpM7yP8NMO8owzLBrqfFg+npW6v8H3e1wy884WoPZF/au/3/p7V2KMNiyy9GhcB+82rj+/4cTx+A+g8l9PHXiP6UAbNlJE124ZS9Xr/j/683r/2dd7MB8mJxHu8d/6SVBFGGUOAMHl58Hik9hmCpx9uXLh//E4G8/v/3/9vsHRZgBXYCWmAHDq7TE6JFIS8yAnjxpCRjQMx4tMX3jDEgcoBseBdQAAKVT61W+yMy5AAAAAElFTkSuQmCC",
    ad: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABeUlEQVR4Xu3TzSuDAQDH8ecP8LLFspXmZRShRLPSis1IRLs4qKHNbSUpYnkJa4bnEQfLUl62npmXlXBYRLOthmS2wjzeS3JwcHRQ++Hmwi7PDrTD9/y5/H6EsMAUJvjL+KnymgGE74mI3SjyEOCU/tY9EcMi9fex620B3hgOguuC6GEeqxQ+ey0cpAKkugI75irsz8th6y9kH7PrS+FSV8FvaIRTJ8bpYBaOJ4sx11XELuZeyMd0Wx0ueuvxfqVFkCzBU3sSQuPpMHcqsTWRxR62SYkw1iLDoa4MwR4FvAYpzmZz4Z+TwNgkx8kyjz3swRUPSiMBM8THs46LG0c2XqyJYGghRpvEYJxx7GFeSz5MHUqESBEuu1PgM+eAmeHhzibCiKocR0tp7GGvgTgs9imxSrVihdLAolfBbmwGPayCZaABj55k9rCvtd3ucnBAZ3yushJT2mrQgzK45zNxu5fA7hq/n/d0jYuAIxXnG4nRO3WkYtj/xD4AnmOmmt/O4U8AAAAASUVORK5CYII=",
    ae: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAgElEQVR4XmN4zMv6+z8Dw398ON5D9j9DsT6l+D7DqGVYNJOKh7NlnwX5vqIbjo63pgffrNk+5TAluGLbpI0M/2VkCPrs/4IF/6kA7o9ahq6RHDCcLXvLykow6XdKSd3U19c/TAk2NzffyPCYgYGgz+KBmIFyfH/UMnSN5OBhbBkAT2NyV9hZxugAAAAASUVORK5CYII=",
    af: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABSklEQVR4XmNgYGC4D8T/8eH9RGCGmQRwB8NvhlHLCGEMw9HxqGUwAw8LCPw/a2n5/5yNzf8Ljo7/T6qp0cgyZYb/R0xE/h8QYP5/wdvx/2Fp/v8nHJTB4tS1jJ3h/7lU6/8Hzdn+Xwh3+v9s+XQwDeKDxEHyGIajY6It02D4f77a9f+ZWNP/VxID/5/3dfh/JSH4/9lYM7A4SB7DcHRMrGVH3IT/n842+H/KS/v/jYbU/3emFPy/kh8K5oPEQfIYhqNjYi3brwRMHFFc/49Y8/y/WZ0OtCjo/7XyGDAfJA6SxzAcHRNtGRAfD1QABpvR/+Mmcv/PWVn9P2GuCOEDxUHyGIajY1Is2y/M8P+Ui87/t/t3/X+9cc3/t7s3/z9uJQ8Wp75lUHxUQgJMH+TgQBHHMBwdk2MZLoxhODoetQzdYGwYw3B0TG/LAEl+KaleNp9nAAAAAElFTkSuQmCC",
    ag: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB1UlEQVR4Xr2SMUgCYRTHHyUkaVLQ0BBCckOgOEQUREO0REMkBCVYpDZISxEtgWNDNBXkILgItglBc0NQEUXDDUIRgUFCLYXDRYNBr3teR5/3Tv1s6IPfnX6+9/953zsAAPxH2IYtjnZAd6fxeWLkd6+3h9fWZdW60YCDpHE/zQI6OwB3NgD7enmdHXG6F/XLkM2PJvQ0iXnjKUiSTADiLeDeFmD52thfmQMc9PFek6AOeeBJv1zqeGyKTDZjgIVjwPNDQ2RSOgVUjwBzu7zHxKVzpkOeqozI2BQqXsDtNcDlkPEUokiE/gzVLUzzjNRPfo2MqJ6rheEA4OMJF4h8FgDXl3hvRMhmMjpXOl8qpFlNjRsvAR2hVSBCx0kznJ0E7O4y+v06D41kxFWXFz2RMkIM/4xrUcMzj1KTaysjMt4QC2iF1ECYZdaVEfHRfRYiQ2QszbKayoptDgzO3LCwRvhnVXxod7KspjLivl/B3ImG2QtsCtXd+QIsQ1pGvIbDKLPeolHWa6WpjNDSaWt2zXrPZlmPHVKyktOJFVW1OqqrUihgye1mPXZIyYhnRcEvTasR0feXQOM5iUjLCOv8ZOYk0pKMMOcnOyeRlmU0v498XnpOIt8E+BwS3lMn5gAAAABJRU5ErkJggg==",
    ai: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACZUlEQVR4Xr2TUUhTURjH74P4EAaCL3uYbz4YPfiobw1EURDmwwgfFs2GNpSicqCSFIaUSQ8rVq00GrGStTBbjbWSQB24NnPYnW7TretWmzUaOnGtIePf7oHJXdebMLYO/Djc7/vu/3/Ox3coRqHYSbpcmJiwo7LyAiiqmyCR3EI2h0WKIjv7ncuJxf0wD97BWksLPt1/uh8/lLOdj3Y+KnoRUqmw6Q+ho2Nc0KysTIXh3nGsyU4iMjQEq3kJNTVDfFEhsqfcq6g4h2s9D+FtbEJMp4PVsgyFQp9nNnxlGp/7LiPQ3g6PbQFtbVq+2GHMPJ/78X5yFixBuxtbJhOSTifSDIOgTEbM2H13fh7bFguJz03ZST2L4Z6NLyrEsli8xwoWylvxMb6oEP/VjNvGsNND2vQ7EEBqZSWvjWw85fORdn5z0YW1MTcgGs0MkkwIX+Ry+C714+Z1S96AjIxY4PVuIm4wkJHX990F+x9P8F8olU8SYSaGmFaLdakUDwYfExGh0R8YmEJ8I4qvajU8Z1SQNo3xRYXYdToj7EmXro6hoWF0P3GQWS4nEqlhMDjwi6ZBn1LyRQWhuhl+sDDq65Worj6N5uau7Du9iKqqTrS2dnFqimjm91uRySQBZhr46UYmFUU6HeHUFNHM630Dsl7UAe5RIBEonZnDoQdoDRC2kZvhtQTb0XecmiKaGY1Zo1UdYKwFNszABzmCvlecmiKaSaU9CMVXsZ4IgfnuQmDLj9vaG5yaIpqxNL58BmoRhNoFGkeOlmgaWVjxE6ZJ1M06IDp+/q98kc1ylJdzb5SjRGYH8Qcr9uN9ONfQeAAAAABJRU5ErkJggg==",
    al: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABbElEQVR4Xu2UO0vEUBCFs3GTuE832c1rNVlBsbGzt7MTsbOz8xdYWCvYWdoJFhaCYGchWPgbthMsJBb+j+M9d1lYxkf24gMLi5Nh5szMx83LeskXCyX8ggqLl3eMn9Afhj1lg0/zEpXDDjo+bpMUl1GMwJ7BTqOp64zMWafPPjkrVA67CGNs1xtYdhwc+QFWXReHnVFkzjp99slZY9hd0sduswXLsrDmeVhxXFQrFRUdnbNOn31y1hh2HSXYn+vopR+JPvvkrDHsPIyw12q/AUyKPvvkrDGMLwAfftu24anbNwlhzjp99slZY9hZL8JGra4X8gRVawRkZM46ffbJWWPYcD7Dw0KOmzjVJ+EJbAVjZM46ffbJWSPYcz7QS4/9Lk6CHk67IdZnaxrCyJx1+uxjv9wxNYwa/yW46D7tY1N9U3xOjMzHgCn+JuUwqSv1ii+pb4xReiUyhz1mObbUqRilVyJz2Bf0D/sWFa/w1i2UbdUF9gAAAABJRU5ErkJggg==",
    am: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAX0lEQVR4XmP4z8BwH4j/0wHfZwARWCRogUctowqms2XtDBUbmxlqDtMag+xhAFp6H9MRNMH3Ry2jBr4/jC070WS+8UK7/mFaY5A9DP+XAjP1UqDVtMf3Ry2jBh7GlgEA73KZMgeA1KQAAAAASUVORK5CYII=",
    ao: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABWklEQVR4Xu2TwStEURTGv8UUuxGa9LJRJPUW/gbZTJJkOztF1Cxko2wskJVR/gEWdlISZWNBk1nIQllYndHkf7A7zvUOcu/13l24Vha/r3fud27fO/e+BwZI4D+AYMRjxOA/7FcIDEuEurDo8cIJDCsLu0JLONLa7ikmIKxPWEY2XUVoChOevmICwkzAk1DTOhXudN3uzYfQBjokxU+0u8DPcmyd5Gvt9Rz8krq9eZgclIzADOhnvuauNS/AM1V3PQ/NkfE85gdXp+C9bXBPOauHh8AP1+CBittbAEHFNj5Jx8DHh+DbS3B1Up4PwOur8qYlt7cAgopt8Nw0uLEJHkyyKVaWskAz1eiI2x8AQcU2uFs+DLoHn8hUj/K5n8n/1dgC1xfAN3Jns1PungIIKrbxjjkqc1fj6fdj6+8F7++AN9bcPTkQVGwjBgQV24gBQcU2YkBQsY0Y0Bsro0eFDgxHjwAAAABJRU5ErkJggg==",
    aq: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABPElEQVR4XmOwqj13H4j/0wHfZwARWCRogQe5ZZ7tlzDEiMSkWda2/uH/n7///geBuy+//1906MV/387LGOpwYOIti5x4DWwJOnj2/uf/9ade/w/rv4qhBw3jtmzCtsf/nZsv/A/uvQLm1668j24PCgD5Et0Moi0DGQ5y9USgpbP3Pv//+O0PdPNRwMUHnzHMINoyUFycuvMJ3Uyc4Pitj/8dGi9gmEOUZSDcvPYBupl4wa3n3zDMINqyNSdeoZuHF5y7hzco8VsWP/X6/28/IUmdGECRz0D4yI0P6GbiBCWL72DoJ8kyUEKZuecZOIg2nXkDTggvP/5CtwecyUFZBV0/SZZhwwHdl9Ht+p804waGOjRMnmVVy++BfQeKz+tPvv5vWH0fQw0WTJ5lMGxbfx5DDA+mzDIS8TC2DAD7o+P0pXertAAAAABJRU5ErkJggg==",
    ar: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA30lEQVR4XmMoXnP/fsma+/9pjUH2MIxaRike5pYtPfnq5YrTr//TGoPsYfjw7ffv/ySAOweW/n9wYgMQb/z/9f0bdGmcAGQP0ZZ9evHg/7WtU/5fWJL/f2+t8f8z87P+X9k0ASxODCDJsjf3b/6/vbXh/6Ycxf9XJ/D931Oh/P/c/Lz/Ty+fQFeKFZBkGchQkOE7S5X/v1zK939/rTrY8hc3L6IrxQpIsgwUXKBgAwXf/kaT/5eW5oODlSbBCAKgBAFKGK+uHfx/Z/9SdGm8AGwZXZM+XTP1qGWU4uFtGQCI4eAEuOjl6wAAAABJRU5ErkJggg==",
    as: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACb0lEQVR4Xq2UUUhTURzGDxjk8EHooV56GJKCSpaLBVFSxoIw6aEXJUKyWBRic9GCIluDORfLzGojItzUZdDWNnUvNW0b02lGmxveZDa6wYwlK6KH2EMPX7t3KN6r2e7WBx9czvmf78f5n3MuIeQC/qeLiBxVW5rQvPUY9CVSuEt3IVCxH/Pn2jPzGywQ4s3Cl/qt+LUYx4oEw4SEM4p/iGLWM5YbTHA4FUFw4C7MyiZcqy+DoqoILm3bxjCh4YyWlz7jtUkD89mD6KgkuFRB8EBKcLWKQFlTjPkZH1tH8glfK5qm8fBwKfQSAnk5QWcNYb9byggUGbBTc3G1lggNX6t0Oo0R3WV2F3ckWXfXZnd2vloEV28np54ICefryyIFm6IRva0yFvL0QLZ92r0ZWGUxtKePwOd5BavVilAoBMIPEKpEIoE34x7oZDuhzLTt5m4Cw74s9EZjLSwWC9xuNyiKyh/m9U7A7/cjEAggGo2iX90OY0sd7kuzoEd1JRi6p2HPlHEsFssfZjNrEJx4xhljzvC6RMS288oeEai3Ac68YBjTNpdZhYhbDjo0hMiMgzOvrt+O25kbaVad4YwzyuuCJD9NY8F5HJ7HhzBmakBkvBuJSSWiU4NYGCyH3dCBb8tf+csKu/oDRhWmfU6M2p/gvbMVfYptGO2pRtijAx0eBn7/5NQX9KiDjjY4unbAZzkBe18DXvTIYLp1FN6XalgMp2A3NiOVSq3WF/y7mpt6jhHjSSQcYti6xHDoxUhSw5yaFa2D8Z0LPJlMIvzOD/rjHBLxWfz4vv68GP0Txncu8L9JMIxvIfCCYXxvBv8DZlG3+IT4XSQAAAAASUVORK5CYII=",
    at: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAASElEQVR4XmN4LCPz+z4Dw39aY5A9DKOWUYqHuWVvs7M/vE5I+E9rDLKH4f////f/0wfcH7WMGmA4W0bXpE/XTD1qGaV4eFsGAF50dnwtqpqxAAAAAElFTkSuQmCC",
    au: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACuUlEQVR4XpWVUUhTYRTH74MPPvjgw0AfFuzBBx+EIIqMRASDST6McKQkNMMl1SzNSVNWaRgxmJk1TchGhaZGijOLKaMk9hKaaNNEzPzIzGY6JcsgKP91vrUx773dbRd+38M5557/9517zneFGYPx9xb7AIulDwkJpyAIZZzZxha8FgQ8tPeGbcnJlXhqbcF7vR6dTf1he4ww4YLhVmBOfxQbLhc8nhmo1RZZseyDNkyfNGG5vh5s3o/MTJs4WTSYQEtGRj3Gz9VisbwcX5ZWodO1hsW6r/fBbrqNdzodvnm96O4e5SeUSRYNJvwtX6Cu7gkaGp5h9P4A1nt7QY//rpOLBUbHsdLcjB8rqxgYmATFErQhmYRKMMG3b/+2T6OBmEmViov51GqJj3DnHRMniwYTJtS7tilpvHiyDouTcbTam8jJaZTYudiCa/jX5sgIxCzV1PCk6z09Eh/Rda1LnIx3MzXZ4OAbiY+LBZcyVFQ8wvelZSwUFeG59Qbmmlq5mNvp5t332WbDjPE0DmUrd2FqajVHbOc6KSnmRbd7Gl+HhjBfUADriRbujGz9pKSz6Oh4ha2xMd6Vjsq2HTOpREQcE2bffvxJJZs6cx57dl8JB4nnjCgudmLTvwZWUoLO4xclieVoa3sJk6krKFattQaq8i7x3UcGGbUNsGUZkXvg6g67RlMLg+Eejuy18HLZ7cOgORWLEHQqErNaXUGx4CINjIX09MtgbO1/3RfmXylZTGJK34cqkphoktjz8x1QqaoibSwmMSpb6EUl4Uho3kTXGlMUo0u5v38CU1Of+Ow4HC8kMXHAFMWoRDQWoYdmURwTB0xRLDe3Ce3tXi60sbHF/3lpabG1vAxMUYyg272w8A4farFPDrP5MUpLH0jsQixiofmjxojWHOSnTVE1ZGJZVLF4UdgU+wMr+cV7y0ozKgAAAABJRU5ErkJggg==",
    aw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA6klEQVR4XmMwnnnmPhD/pwdmMMZhWczswxhilGKslvnXLPu/ePZ6DMWUYqyWdWfU/1+fWY6hmFKMYpnb4ov/s+Ye+L/NLeD/GWf3/7kz94DF0DWRi8GWBa+88n/24p3/93gG/T/DwICCT9o5gYM0bOl5DM2kYhSfec07/b+id83/PQ4e/887OP2v6Vz+33fOCQxN5GKscTYhufL/5tQiDMWUYqyWhZfO+b90xhoMxZRirJaZTj/5P3H6XgzFlGKsltEKD2PLVl4N+7Dppu9/emCGSSdz3848k/afHpi+ltE1GI3pmUCMh6tlADZEihdcFfZqAAAAAElFTkSuQmCC",
    ax: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAgUlEQVR4XmNgCF76Hxe+v0/0/89t7P8vCZiA8Zd5vP//n2PAUEc0xhBAwqOWEY0xBJDwqGVEY5BmfBibZeRiBpBh+PCXhbxwy973CGHIk4IZYAbRA9PXMnSvomOqBiN6JKJjkCKYZRQnEIzkiYSpnvQxBJDwqGVEYwwBJDxqGbEYAMyZptesSPVcAAAAAElFTkSuQmCC",
    az: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA3klEQVR4XmOQWnX+H8POJ/9pjcH2jFpGKR7mliXVTfsb2bT4P60xyB6Gm2aWv99qWv4nhN+Zuf7/2jXp/68Ll/9/mz7v/5fqFgw1+DDIHqIt+7X/yP+fO/f/f6tjAxED0h98Iv9/8I5AiOHBRFsG8hUIfAxNRIgZO/3/feHK/3/v3v//4BeNoQcdE2+ZgT3YUAzLLl6lvmUg/H3eUoxg/JRSQP1gBGFQUP7ctOP/n/sP/39t7fv/KbUAQw0+DLasttj8ZUOh2X9aY5A9DPZzTO8D8X864PujllEDD2PLAChl+/zJQ+hdAAAAAElFTkSuQmCC",
    ba: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABBUlEQVR4XmNgYJh5f/HiW/+3b3/0n4Vl9n8ZmSX/ebgm/T88R+X//zMMVMHz663+g+xhABECAvPBFjk7bwFb6uCw+b+I0FSqWYhiGRCDOP+Dg3f9B4Hq6lNgPrV8iNUyG5uN/w0M1vz39t4ODk6QT6lhIVbLYFhFZfn/48df/r99+yPYAZRaiNcyEEZONAoKyyiykKBl1Ew0BC2DYWokGqIts7BYD0407u5byU40RFsGw8iJhlQLSbYMhMktaciyjNxEQ5ZlMExqoqHIMlITDUWWwTCxiYYqloEwMYmGapZhSzTiYtNRLKSaZTCML9FQ3TJ81RPVLYNhDY2VGNVTsn8cSO4+AEjVj4R/Lf9xAAAAAElFTkSuQmCC",
    bb: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABCElEQVR4XmNgUKu/D8T/8eH/x9UIYnQ9WPB9BjCBKYGC0Q3GhtH1YMGjlmEajo7R9WDB5Fn2eZ8Khhi6HiyYOMt+H1GFGwpiZwYJoFgEEkPXgwUTZ9n73Sr/Q5x4/19fofB/TZvUfxUZ1v8bOqX+n18k/z/ClRcsj64HCybOMpDre3JF/zekCIPZIMtAdEWc0P8JBaLUDUaQYSDX2+hzolgG4sPiD10PFky8ZSDsYMQFpvVV2cG0hwU3XA5dDxZMmmUJ3nz/NeTZ/lvpcoJ9B+LTzLLX25VRfAjj08QyGIZZhozR9WDB5Fl2eIYshhi6HiyYPMuwYXQ9WPCoZZiGo2N0PVgwfS0DALs9Niz17yWoAAAAAElFTkSuQmCC",
    bd: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAyElEQVR4XmNgyPK7D8T/6YDvM4AJTAla4EFomVa8z//4QM//va5u/1vd3f77h3r9F0/xxVBHAOO3jD/N9/8cR7f/X7QcMfBLXaf/aQEeGHrwYNyWSSf7/L9p6IxhCTpeYu+GoRcHxm3ZaltXDINx4ehgTwz9WDB2yzzCvTAMxIef6jn9Z8nEMBwdY7cMlAjQDSSE9eK80Q1Hx9gt22xNfBDCMCi1opsz+CyjazDSNYGAMN2SPgjTNVODMN2KK2RMl4KYyngYWwYAdR/x9N6BxxQAAAAASUVORK5CYII=",
    be: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAU0lEQVR4Xu3NoRWAQBAD0S2AAq6M678TFEWAP8BO8haHivh2pqrqeKzO2rdP55ita8z3k1mPccpMwg7jlJmEHcYpMwk7jFNmEnYYp8wk7DBOv89uanxHAdHMcG0AAAAASUVORK5CYII=",
    bf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABCElEQVR4Xt2QsQ4BQRCG5w28gcI7SNQiIfEmeoVepVFolCgktAoPoNAQUUhUd0IhFCJ0FOP+bC5xs3fZXUFC8d1k/5md77LkEfkB/AV8wiem8Ql+QLZJ6ZkFr8mubT2zwF22yxDzVVXZM+AuO1WVDFX2DLjLbkslQ5U9A8mybTr4+1qUc12JQnCWM7gndxllYF8gvq+jgiQwh3m5IyIrNume7RInke8Tj1b68mfQx5y8+ww8RllIa6pLAHI5G4eTrL/QRQC5nI3DWpbrER+OavnlRNyZq4ozcvTlHYm1rDJWi2cecXmoMlSckaMv70isZXiqxkTPAXKbp7SWlQZ65tIH1rJ38N+yBw7+JCYCpNdnAAAAAElFTkSuQmCC",
    bg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAXElEQVR4XmP4/////f/0AfcZQAS6KI3AqGVUAXS2rP3c7o3NZ3YcpjUG2cPAMC3vPhD/pwO+P2oZNfBwtqwo2m5jXqz9YVpjkD0M19SE7gPxfzrg+6OWUQMPY8sAHjGPHWGaYUEAAAAASUVORK5CYII=",
    bh: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAeklEQVR4XmNgAIL////v/48H/P3y9f+bxav/33QN+39OUI1sDLKLoGXI4Pu1W/+fVLX+v6RijmEYITz4LKNrMNLVMmRA82BEBjS3jK7BSFfLkAHNgxEZ0NwyugYjXS1DBjQPRmRAc8voGox0tQwZ0DwYkQHNLaNWMAIAyWjHPoRLtGYAAAAASUVORK5CYII=",
    bi: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABkUlEQVR4Xr1WPU/CUBR9A0YmZ0YSiQMTg6OTCwmbv4CNlUkdWE2cjAOLGwMLiTEMrCZvIMbFpBqiMUHzNld0EY3R4zsPW9tb0QLCaW5fez/Oyb28tig0GkAmAyg1PyO/1bFXFoMBUK0CqVQ8cRYjH3nJb6Hc2UevB2xsxIumMfKQLwQ1fB9GHA7N5vSjZR3rBaijcjc5dJ46MhYfLddyGajXAa1HK+/D8dDIwiA/dZTyFGjFuyL6L32ZNxpFpQJ4XuAyb+Y7Tj/jYmQE+cjrawRitPRVGrWHmmt5HPT5IVo7ebeOA+vJQ74wf0TMt+x1Fu3HtuRw6B7vorW1BH2yLUMOrGO95Bwr5lvpvoQPe0gY05Uul8d8yZFYrHBbkJy/gvmSY2Ix7/kC+uzA/U68dr5XD/ryCPp0L/DNJBYeo8mvwKxnRi18wWyuwawu2x0xnH6McoO4zvS+M3bkfOzMdqo7taAzIvEGSbL1k+DPrT/JQx3BJA/1Ql9XP45sXi/iiGfenxh3liP7L4t9PBf4t+AT+IHP3BVGqewAAAAASUVORK5CYII=",
    bj: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAQUlEQVR4XmMwnMLwnxhcsJLh/P9rDP8pwQzohuLCo5bhw6OWjVqGFw9Oy9IKWM/fUxT4TwketWzUMrx41LKhZxkAqmySUfQ2LtcAAAAASUVORK5CYII=",
    bl: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    bm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACL0lEQVR4Xu2SXUhTYRjHd9mFdwp1UXZTQS0ShYJA2Aozu1jm0Uo0jmHh17ENnTlT1naarFm5ZbqseVJSy6ykdmGUSi31bAiala2LCqMUBakru5HKfzwHmpNzcRDObqIXfi/vx8Pze3ifV/P2Qsvygn8Ano4gNuxtgGaLFfr8doST0zF/ySvtiUPHWhGsvYqFm114WNOKyQTt2ojXftYkbj/3kzcK+Gjz4K+U4XoismhJYGhKKqRkY448mRIkG+B9y2J9G4JOAeGqi5hz+/Dt7iNMbUvFNGvEbJ0LX5raMdl4GxRH9J60y5MpQbI3u9LkFwq8zCqTnSlCMqvD/9vW9Bwdfa8w/f4rvvc8xtyn+cgzLv5YwuLrMMa8vbgsjIJi3Udt8mRKkIzJu/GLekE9od5Qj6I/yDotD5PjCWaGJzDjbEZX1XVUJ5+WJ1OCZE9dnUsjpTxsDI/DiaxE2T4LQrkmDNc1R85ytp5Cm70bAfcdPDOsfsZxr4APwRAGfQLul5+R1sQLXeZqGU2yKtZI+IEfNELFxeiOi8OEKEr7wIGoX6um7JrbAUueDvZSHRot5RDFd7GTVVYwOMGmQldQgeOVZzHY74+N7JbJjKLs3UjXJ0G/cxPY/ELUHtwfG1mniwdXY0dJtRcNLfdQyJnBe6wYyshaiVNLdsXMICVlMzILMmB0csjesx5skR5j8TtW4tSSEX3sEXD1BuQ603DeaMB4QpSIUFOmyH+ZKvzTsj/M85mat/P9QQAAAABJRU5ErkJggg==",
    bn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAC2UlEQVR4Xr2SXUhTYRjHj07l4Oa329yHO7qGoRlFKpEZfVh4IRUTUwS16OMqb7wyc12YBl2YRBEVShEZklIXkotiBTUIlEIlLHPaySZL1OXGdHNt7d/ZIdd2dGyE+sCP93Dec57f+5zzJxzfxDQDNgGacC20mJ2mYu7GRkATHrfJBaaYFS7rXThnypkNGffB9eCfzL88v81wL/bCOXsSjikl96X/ZW1ZQHmW4V7S4td8PZa/Z7Mvzj2QY+ljGrdZKMKQBZQLDvo5ppvVsLwp4DYLBU1UVhzztLa2wmAwcDuvWdZXesy03YJF+5qZeAQuSzvCDBhNUJTcQxAEvKhUKmg0Guj1eq4DC0/7YThajWFhNkbEuRhKysKXQ2Ww6QfY/TACFijzZ6tMjgsVVdDpdHA4HEwjK3729OHH1Zv4XFgK05XrmL/fDfvYhO9A9tExuC3WYAELLuMREWjii5AfFQuVIAF16nJ0dXXBZrPB2HDZJ/BO5hifZNep+kvwuNy+Pbb+Bsw1Xz9LdNzYZzlemg2SjF4lLImJQ19CJivcHkWy90iSxO2sXejs7ITRaISlX8dO/CnvCPupg5U3iIR3PO+Yc6Mi9HQkokpNIiU5im0sjYxGPyPL4ZG4lyr3HaI3nvJdPy7Yhjvn6zCcUwTn1DTX4asAmT+2CTG0j5LQWBmPtlQJ2/TF7nQ0xosgYQ7QLpCC4sWgSSiErkjBfvJmfhr2KoMHLKhshcWhNJi7ZRjsFeLJYSneH6DwYU8mnkkoDOYp8a6YwsVkIeIieCiMjkUis65MLJeJcPZMjS9gIWVe7BNpmKzOYBK4BYYyJUZOZEB3UIGH+VK83ElhdIeKnZT7v/0R8Hk4V5trDylbGhfD+laCaY0CpmsK0LUZGC9Rgj5F4WtzOvrUEtTs5yOejFwl8Ucm4YWeLFwCA7ZavK4yf1YCVnc61ivZWBmXAW0KWhoE5k2R/YX+AzUcy+SXCSTBAAAAAElFTkSuQmCC",
    bo: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABD0lEQVR4XmO47iD976q23H9aY5A9DKOWUYqHuWW3y4X/Ps0X/k9rDLKH4fEVtt//HzD8JwY/OMrw38hA/r+lMc9/ZUVRDHl8GGQP0ZbdOcT238mS9z8nO9t/T2f7/1xcrP+7KsT//3vAjqEWGybJsuwQtv8eWhz/3WyE/kuoKv43iXT/X+TB9b8hjQaWTchk/R9nw/5fLtr/f0lf7f+Utur/cbbs/ydls2GoxYZJsuz8PNb/Dba8//UDrP/r6Wr+ryiN+D/Fg///wzU0sOz9JYb/a5rY/1fFcv93NlP+72rC/n9zKydYHF0tNgy2LHqe4sv4+Yr/aY1B9jAwVBrfZ6g0+U97DLRn1DLK8XC2DABID4gkv4MsmQAAAABJRU5ErkJggg==",
    bq: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAXUlEQVR4XmPYaurwb52Mxn9aY5A9DKOWUYqHuWUnKpv/nims/E9rDLKH4fnrT7//0wGA7Bm1jGIwzC0r6Nj6sqR7239aY5A9DIpuPfcV3br/0x733B+1jAp4OFsGADj8ivtJ5t7cAAAAAElFTkSuQmCC",
    br: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACeElEQVR4Xr2VS2gTURiFu/VVfIAblUq0PuhDCSZEYkVrFYuhYqkGFUUDSlFpUetGhKKgi1AFEasErCVOkqmmVtMmhtpKa1oTH1hBlKKNaaiCKAhZCO6O+UfmMjM3k2a6cHGSzMx/znfv3Hv/FJk6tqeywn9Qqog+cjzIq7Wd27h7BcgYjCA3YqXITM3B1eHVKO2s4WryqHDYnm4bPn5ahD/fZjHRNd3X1upoeli5txp34iYG+DmxEImhCnweK5Guf0/Nhmd0hVSn9RqCHQ5ZkJxYIIWOvzHhYFMrymrvMdn33oJXqJWeU92BRxYuY1rY+uwoxVfL2Wxex8pgrutQgZRquXSS1ZKP/NrMnLDGiBlfvxQzcya9GFe8AbTcDqK5rQ+Oxm4ORgqH7MxDfsrRhVl9W/D47TLVBiDFn+9Dm/8ZrnUNolXoQXAkgXjyA65H+rD/TIjBXGfPc97w2FJs9G9Ww05HK/EjPZcrJt30NGDHEfVszLv9OHE5AvFFDO39YWxy3oet3sN5SZR7rr/iH2zV3ZrJCwPl+JUHRoBKhwDH8YfS7+pDDxj42MUIfImnOOUWOS+Jcilf9RqrAlWIvlvCFQ88scLZ1JsdvSgBZZitQWTAna4gQsODnJfyuNeoXMjm6Dp8T81jhsxkMXa53LDU+7PALimcvglMIqg9OxDlBiE/LY0yNyeMZBa25tz6BFSuHa0lgZVbnzYZ+bWZujBZeodafp10qH2BOul5OjkfR3s3cBkFw0jUhqgdUVuiUG27IgkvdQ+yMZgsarjvx9WNmGbt7LFytToqHEaivxT30BppO7ePriyk+SplDCbLIETWzGAzVOovp9+8Vc9tEk8AAAAASUVORK5CYII=",
    bs: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABTklEQVR4XmOQDgv/JL1w2R+Vy7d+0xoz8JmY/mZgYPjP7OX7n333of8c567RDMMtA2FGXt7/rCWV/zlOX8ZQSA2MYhkMM6lr/GdbuBxDMaUYq2UwzBwY8p9931EMTeRivJaBMDhoqxswNJKDGaRNlf+iW4AN8+sr/7dYWf/f7coCsjGDrSUPXp8hYxYWhv8Z8Qz/399i+P//JemYJMtgWEKM4f+SaZiGEcJkWQbDNuYM/2+fwDQUF2YwNeIiyzIOdob/DaUM/78/wjQUF2aQk2EjKoEgYxc7hv/Xj2AaRgiTZBm5cQW3TFBa4B+6oeiYiZnpv2aE2f/4U7X/U2+0ko0Z2CUl8PqMmkUX0DIp7JZxcVG9UMZqGbOL23/27fsxFFOKUSxjlJL+zzZxOoYiamGIZczM/1kSU/9znDiPoYCamEHE2/cn+7otGBK0wABkPqhRhGUlBQAAAABJRU5ErkJggg==",
    bt: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAC7ElEQVR4XrXVW0jTYRjH8e67qEyyA2tKgiAdiBK6KrJITV1KJ9IsJEtKq1lGpjjNsk2cOd1sHjewcrOyNbDl2jysudYqCo9IRhO68MILoS538W1NNHVGNfPid/W+7/P5P/Dwf5YxFOr2hiXNGyFIQr4tY6kxowBSV8PJYM+SYW5LBFSvgyQvJApaHDbRK6BNvQOVNJHW2iQ8Q1t+QcYw3Df3TSHTCRQbtwno0KVheZqPokyMsa0Ou83KY30jw+ZiXhZlYC9Ip/OgF41ZRGeTbzZia92DpiqF/NxT1CgrkMvl6PV6TCYTDruNXtlV3PtXMh6zcvGdefqF1Fdn+wC1qhyHuYZnTQrqzh3lYc4pjBeSseeeYCI+ePHYZ7OQdt1FGhvqkJbewliWx3DCBj6djqIgcTcjtbf5mLqDicSQwLAxqxCHIYmG0ggGTLv52r2ZrkdKtFotTQo5H5wObM1q7lfKsGuVvJBkBTYg4654VPJMGupVdFlNGPRKnkjSaVfLcTqdNMhlvJbmoL2Yij05kn6xiLHksMCwxvI4tJpGmuuve788C1N1Ca+eP8Plcvk6K8lI8RV8lxA6F/hXrFe/E6VcTF2NFItYgOfQakaiV6DZvhxVWhwGgwF7SpSv4NDeFXgSF4D+FuvURaNQVKJTyeipKORxeqzv8WTcKlrPH0ZbIcMiOY8zW8TzqjuYj0/BflkIG+0IY/RlJKMvNtB9fxv1imLKiwporlWhu6fg+5dh3Ic3zRTp2xdET8ouam6IGVCXMCi75A/9DptwhNP9NAOruZUyWSmV2afpOXuApuq7jCWs570o3L+QNyOZ0XTknaGv6Izf2YLY5NutWB+lYTW1YKq8xgfpZUheg1skQF8o9k7bSfqSFsb+mNnYpCsMa0sszgfpuI+E+H430xeHYtfi0GsY1JQzeCzSv9DfZE5nA8K5K2FeLBUSHLlTIx5QZrCfm/TKGv8LszK704Diw9oE475NOv/wf8eL/QALp5/oimYktgAAAABJRU5ErkJggg==",
    bv: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAi0lEQVR4XmO4rqHxHxf+9eTJ/4Tmff8ZLKaDMQg8jIvDUEcsZkAXQMajlhGLRy0bgpZ9PXnyPy7878cPDMu+X7+OoY5YzAAyDB9WCVkGtwxdjlTMADOILhhDgJYYHBF4ANj7UMWUAoZnlZX/cWEQQLfs/Zo1GOqIxXiTPjbLQJrQ1RGLRy0btQwvBgB/oRfH8ORepwAAAABJRU5ErkJggg==",
    bw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAW0lEQVR4XmNgOPP/PsPp//9pjkH2jFpGMR7elkXf+/8y/t7//7TGIHsYNhw89mf//v3/aY1B9jDIyMn/Y2Bg+E9rDLZn1DJKMdgeuiYQuiZ9umbqUcsoxsPaMgAczU6qMpOkswAAAABJRU5ErkJggg==",
    by: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABq0lEQVR4XrWWz0sCQRiGv/+qe8f+hDrkxSQio7qFdtGwqAxLC8K1tp+IHaLICgyEoCgyNZZK3fXXthBEBVFdHHmblg7VXGcPD3N54GNm3u+boedstlWdn8e7rqMyNYVaLIY9Ikeg6twce724gDE7izdNgzY8LEiyoMbyMjM3NmCur+OBr6VAQJBkQbwAa66uwtrZgZVM4t7nEyRZUHl8vP1dTA8GYaoqbrxeQZIFPaZSrUJvL17Oz3Ha0YFqOCxIsqCbvr520ePBdU8PCi4Xim63IMmCrK0tVl9aQiUUgjYyAiMSESRZkJlIsKdMBsbMDD7qdWhDQ4IkC7JUlTUTCbycnUGfnIQxPS1IsiBzbY01FcUOyB2Pvc53+F+SBZmKwp6Oj6HzHX06fow8ILXFRZQnJuxR5WhArgY9rQKPe667G3nebyeh/veuBco7ARnpJPvd1EenYXSukCNQMTjWbsTjKPn94PeHg+iAIMmCKrs/g3h72x7EhymfIMmCSpt/n5j0fkCQZEG38Qh7vby0++v78TxQRgVJFmTms61aNGp/C8p8Ph7mYoIkiy9VjS4jz/SMEgAAAABJRU5ErkJggg==",
    bz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADBElEQVR4Xr1VXUiTURjeRZddZDcJ3nhREWQkJmIaqElqGktFUyvS1PAH02qmZhPTdP6tHJmbloKtZLJQshQhZhaBqTjn79z4Jt90k82fUtjFKomnnROCfJhLMQ88fHznfZ73+b73vOcc3ojLUdYB7AFYXpxH4ir/RDL+N4gP75CfcI0XUAFn8M14AYG0F68/TkPDWOmTvJN5LnczUB9nZvvDHuF51yh+freD0Q5jTj8BrXaIPicn+uk8iRMeV7stM/c4KWbMy9REr1ODWdCjslsIQUs6BPI0aPQaGJlJGic8wufm+CezfWer0KuegfrLe6z9WkP3h3c4J/JCdFkw4u+HIjjRDZ7Frnir6qTxof4eyic6bi6nZmQ99GMDsK/ZQYb4agDqGysQUxiE2JxAXCnyRDL/CPinTtI4MRwf+UR13FxOzUbGdVj+asXTsmLkhnmjJOQgCnP4CCw/jvPxHvArOIaUhBCEu7og2scLjTUizC8aqY6ba0uzAxG1MBum6dcuGI2ouuyPthJ/VBdcQK1YBFl1FnIzgxDl64EMb3dkR4bDbluB7YeN6oiem/OvZsG3FXTh10vIsizq6urQ1CiDVHgH5fk3oJDkoUCQBLFYDIPBQHmET3REz825pRnpsI1mKpUKz2QymPQ6PHmch07ZGUirBXSexNfXjei2ZUbKsGwxweYoDRkMw0ChUEDaLENlQyukLe1okMvQ1iqFUqmkcTKWVqxUt60yEjDmb9BNDGLMNApxkxCp9UGILPXGYUdznL6XjeCSVFwS+iCliI9X7c1/KqDVUB03l1Mz0sIrixYwM2OQdj1ArbwGUakXEVHqj4ASN8Q8DEVCdixELYVo6KjCoonFktW0s9Ynm7NPM0vLQgyVb1QQ3M1HWnomJBIJriVdR9bNW+j7PEKNZmanKH9Hm5qAHD+sZRVWixGGqWHI5S/R0TNAG6KrV+14b6Hz5nkD5e34uFrH+kFMOo38pXqsj7b39NQgZud0dK125SDeiF25Yvb08iTX9SZX+P8A+xvKbc7ABIEtXAAAAABJRU5ErkJggg==",
    ca: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABDklEQVR4XmPYz2XwHxt+0DHr8H8yAEgfulkwzIAuMGoZLkBVy/5+//n/Ye88dGE4oJplH46e+/94ytL/B4XM/n86e/X/54s30JVQz7JrSdUoat7tP4muhDLLQK7/cvX2/yczVvx/NHERipofT16AfQpSA2JTbNmtog642OXwQjj7sKTt//PuKXD+q/V7KLfsZl4Lhhw2/HrzfsotAxlySMwKQx4Zn3WI/f/zxRvKLQOBjycv/T+q6IyhBoRBiQaUHWCAYstA4E5lH1j8uKbX/2Oq7v+PyDqA+V9v3kdWRh3Lfr15D2c/W7AeTP/5/BXFVyBAFcuQwb3GqehCcEB1y2A+wwaobhk+MGoZzS0DAP9S58fuv+G8AAAAAElFTkSuQmCC",
    cc: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABaklEQVR4Xu2Tvy9DURTHv4PBYJAwiEgY2AxG/4GBxGAwGA0Wg8Qu4kf9aNMEsYhGQ2jogGpikqISkgoTA9EnkVgNBoPh6x33SfN6Xl81eSwMn5f3zrvnfu45915gHJYNfwELnw/94yf4K7L2BTCcBmcOwKawGvwtakM65lCQieDtAby+Aoe3wacbsHpSJfjStwbunuq4g5HJpCIa2QHrZ8E6e3VTKbA/rhJ8kVyhOO5gZFL6yx34em8kY3FwLwsuHboTZFED62D6DBxN+raMDXNg57KHTD42jkA+gs8n4G3CvHevFgZXTYDnOTBzYSaSWHME7I2BLREtk67I1njKWqNg7hLM25Vl98HBTXdyx6JZQE/MHQ/ZE3ataJkH+uiXao1U857XssZ5PXZoS8fgJfMjkXG3sS1q2ls8rgSVyaRquYdyQGQ/K7walcnKIVV+Ve1BsDI5gcljHXcIVlYz7dvaYGVl+JcFgvUBkVxRiUkJXe0AAAAASUVORK5CYII=",
    cd: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABlklEQVR4XmNgqP9/H4j/0wLzt3z8P2lz2f/Xa2X/Xw5Q/8fAgGaZcNvb//JdjzA0kooTFi79//iw5v/7CXL/zwsr/L+groxpWcS8tf9zls7C0EwsNpp44f/Bw97/n3fK/L+ooPD/nIAiGGO1bNXuhP9b94dhGEIIIwfZdWt5uCUYlil33/t/5rjD/+/XJFDwlVOW//X6r2AYjI7RgwzdomuW8v9vLNb7A/cZT/OX/8t2pcAt2nkgCCyGbjAyxhVkcN/IKP5/1ib9/+hB9/82U489QwnGaVuK/3++KvP//WV5sMXohsMwoSAD4Xtxsv+fHVL7n7Jo0X+Wht8gffdRLDt6xP2/1eST4KA7ecz5P0fTDwyLiAmyd6ulwA4HpWwkvQjLQK5FlgTxxdtfwvmkBJnZpDMYjkSxDBcmM8iwYfyWURBk2DB2y6gQZNgwqmVUDDJsGGEZlYMMG77PYD759DMaBBk2fJ/h5lL9PzQIMmz4PgOogES3hApBhg2jWkbFIMOGEZZROciw4fsMl3zV/tEgyLDh+wDEWSNuXMu1yAAAAABJRU5ErkJggg==",
    cf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAvklEQVR4Xu2SsRGDMAxFNQQFBQUlI6TMGBklHenYIQswBiUjpEyRIkWGUCyHUOjbOpRQWncP4X8S77gzETF/6brb+p4CgkAiMgiPqnpx2955ng+xyxkHd5LV9ZOn6Shfi13OOLiTTOj7C4/jiYfhnBj6AAH9KGuaR+y5vxIgIKeMPQXbznUdmKVFRbaUc/pPGV3DjdoIiAhnTCAw0KIiW4HAQIvcMo4XciMJGcwYyAaEWbSoyBZkA8IsWuSUvQGxrVdJSd3VKgAAAABJRU5ErkJggg==",
    cg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAeUlEQVR4Xr3NuxVAUBCE4S1DCfovQyhRgh4kgw2cY3Ht8wZ/OPMRTYRo40xYNwLQjuTQmhbCEsQsEIYAZoUOyYd5IBfmhcxYBDJhUUiNZUAqLAv6xTKhJpYNfWIV0CtWBT2wSuiGVUMX1gNirBfEWC+IMchjWRJ0tgNYh9XJ2DvWOgAAAABJRU5ErkJggg==",
    ch: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAf0lEQVR4XmO4qi13H4j/0wHfZwARWCRogQexZTftjf8/SAiDYxAfXQ0eTJplT6uK/iMDEB9dDR48ahkE09Syj9s2/v/15DEc/3n3FsUyEB9ZHqQe3QyiLfty6jiK4YQASD26GYPTMroGIzqmaQJBx6OW4cCkWUbXgphCPIwtAwAjmQWEGHIX2AAAAABJRU5ErkJggg==",
    ci: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAARUlEQVR4Xu2NsQ0AIAzD8v8J/MQNPaUwR1HDxBRLXm30Ql179AFsOAuZOUSczcwj4mxmHhFnM/OIOJuZR8TZzDwizv6dHYIW3szeE31PAAAAAElFTkSuQmCC",
    ck: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACtElEQVR4Xq2UX0hTURzHz4MPQj6I+CC10vJBQYuBYBJBI8FXtUEKoyyU1DZ12mL+CRUmImkZc7LhH3rQcqklSeLLaIQPxmYKEebc5nUqYgMNpB58sG/8Tl7d7mSp8+Fzufece7/f3++c77lsvrhs97fTCbP5E2JjtWDsAedV+yhmGMNCh2l/jKgs7MTi/RL4LRZcStQHzf0HgeUo2ja+anRYq62Ff3kDKlX/oWZX0hoxXfkEKxoNfnp8qKp6g6ioMqlgOARGF/qopcQIz5272Bodhd3uwrjlAzdzPetGt9oIr0qFbZsNIyNfIJMdq6MDM0ff253FofcgvMPjWO/p46JbVis3o443BwexNTEJ37sJ/p7IxXOPpILhENic7PwfEj0JmbKHUsFwCMzV1Lq73twMKStaLRf05OWFzImkXaiWCoZDYImJdatJSXXIzzfDNb8Gv8kEr74BjmEbN1symjE768O23Q530T20V/cjObkB9M2xAxIXV+3r7Z0CxX+psBDWmhf8CEjTWFo6iM3ldZ5Gp0aPa1dbg8QSEnS8ALX6Nb8/JEQC++5Y2FnV6TBXocf1zJb9SakZER9fg4GBz/g1PQ2PUomUs1pER6uRnt4Mt/sHN+jq+sifnc7loHPLzW5nPPbfyqoPWZLLKfUolpcjJ6NBWiEXu3njKc5El2NoyIGCgh7eTeA7onFR0csDs3+XYLGjolB08KWTjotQUQR1zyI16+y0BVZ+KPQbNBgm6F6IyCw1tVG6LyHQcsrlBroXTmxGJlNTbh4a6VwglE7aOxaJGUEVZ2W1hYyLUOiys58jJqaCnoWIzEiIqt4LQAgUDur+VMwISiPFP/AQkzgdh6am8cBChIjNaO+USgtyc7sxOfmNdzs2NseXeC8YIkLEZiK0P9QddUUplc6z0zQ7AsJf/bKzyifrMZ4AAAAASUVORK5CYII=",
    cl: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAnUlEQVR4XmNgsFx6j8Fy2T9C+Pbjz4/+////jxLMMOCWCbiuoY9lKqGb/1XPvEhby3icVv/rW37j/6ELr/4/evH1/7wtd/8bxG2njWUgrBC06d+7Tz///wNKxbecoJ3PQFjEY+2/U9fe/p+06ub/9K5TtLVMwnv9Pw77lXBf0tQyfHjoWXZFR+7eVW25f/TAo5ZRBY9aRhU8ahlVMAAPk6POpXnJ/QAAAABJRU5ErkJggg==",
    cm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAmklEQVR4XmNgqIq7D8T/8eFzgmoE8Z+LYoTwfYZRywhhLIaj41HLMA1Hx1gMR8fkWXZBXAVDDIvh6Jg8y970yGCIYTEcHZNm2R03xf9fNkn8/3NB7P/XTeL/77gr0s4yEH7VLQO27HU3qu+wGI6OSbfseaXs/0vKKmCa5pbhwlgMR8ejlmEajo6xGI6ORy3DNBwdYzEcHdPXMgDNvr58PjKGSgAAAABJRU5ErkJggg==",
    cn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA0klEQVR4XmO4pylwH4j/0wHfZwARWCRQ8BNv3v8vU7gxxEnEmJbd1+f//zyCB0XhEw/e/6+LuP7f18YwgBSMadmLRO7/n+eyoSsEY5APX8SR7UOEZY8c+P5/38Dy/+9lxv//7jD8/3WUCSPoQJa9zudCN4RYjOqzh1Z8///fYwDjN6Wc6IopxaiWgYIIFISg+Pk0hR1d8f/Hbrz/31Zzkht3mD7DxoZhClMlZgLBhsGWpJNtCQwTbxkoYZAZfDBMnGVUwqOWUQWPWkYVPGoZVfB9AFGxbLBnvwHDAAAAAElFTkSuQmCC",
    co: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAS0lEQVR4XmP4/4LhPhD/pwO+zwAisEjQAo9aRhU8ahlV8HC2TEa77jeDSN9/WmOwPaOWUYrpb9lhVtl/txgE/tMag+wZtYxiTHfLAFOu6xF40qDmAAAAAElFTkSuQmCC",
    cr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAf0lEQVR4Xu3VMQqAMAyF4RxEPHUHNzt5Ai9RbyAOT+gF6mLBitHg6CjJIBb+LBm+KZSIelyxQaB7PBYawRYLIWVgZe3EoRhzYYMnji02N92+eM/aiUNTVR8jEWsnzo+97uNYHKayAaydOLZHbYo5h9S2kbUTx/aLucdjoRFMsRM+Jlz6FAak/QAAAABJRU5ErkJggg==",
    cu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABeklEQVR4XmNYJuHxxcJ2x3+GgA+0x5c4pX6/ZWD4P102/L+U+zVMBdTEMMtA+BEL9/8izZr/7L4vMBVSAyNbBsPnueT++5otwlRMKX4jK/8P3TIY/uTi8v/P5cv/qQXwWgbGLCz/v2Rk/P/3/j26XpIBYcug+J2AwP/vU6b8///7N7oZRAOsln2Ojv7/XkYGw0IQ/qCj8//Xnj3o5hAFsCaQn4sX//+an49hETKeL+X/X9H1HGYiwIeRLfuanf3/3+vXcJf8+/wZ7Et0i2D4GTPH/yr10v/cPk8xDcaG0X32tbwcbtknBwcMC5DxS0aW/40quf/5vR9iGowNo1v2ffLk/z+XL///+/RpvL5aJe5CejCiJ5BP7u4QNjDJw9lI+IOGxv9fO3bAfU8KwLAMFwYn/Z4e6id9FAzK1CkpKAmHXIDXso82NuC4oxbASCAgfJlT6n+g6TzMCKYUI1sGyjdlGhW0r2JmywT/l3O7hKmAmniVuOtXejULANQxg7bXK+sbAAAAAElFTkSuQmCC",
    cv: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABdElEQVR4XmPgkCi+D8T/6YEZOEYtowIetQyO1fXTMMSIxURZJq2WDcY80oX/985V/R/oFwwW1zZKwVCLDxNl2awWk//TGs3AbJAF8pqZYB8+2SXy38o2DkM9LsygoNf4HV0QHYMMB2FkMZAv9U2S/oso5oHZ6HqwYYb////f/48LfL/y//+j3P//f79Bl0GA7zf+/39ciF8NFDD8efXi0e9nT/5jw38eH/3/91YxhjgKfnLm/9+bOZjiWDDD07So7/csNf/TAzN8Pbz3xeet6//jwt92N2OIIeMvO+b+/3ko5v+X7Usx5NAxgTgDxscVdfzx8evJ//8PEtFFsQKGsMT5X9RNW/9jw3qWjf+1zJvBtKFtPYY8NjF8mMHBZzLBpF+S4fJ/UafBfwHZfHDmBomB6J2z1f6HBgZiqMeFGSQ1as6iC6JjUMb19AgH5ylQCRIT5g8WjwgO/G9skYChHhcGlSD70QXxYTuHGLLLR5ItowQDAGL8XYxc878pAAAAAElFTkSuQmCC",
    cw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAvklEQVR4XmNg0K6/D8T/6YIZkCzjMGrGVEBNzAC1TMap93//ouP/Fdz6MRVRCzNALQsuWPkfBMKLV2MqohZmgFqm4TMZjA2Cp4MlRGw6MRVTihlwJJDqiXvhFlMNM6BZxqLXCI47EHj/6Tt1g5UBi89UPCf+P33l6f/jFx5jaqAEM2CxDJQiQT6UsO+mbnZgwGIZzTDDsLWspNn3bU2X1396YIa7l+V//3wh8p8emL6WMdAzzhhGLaMGZqCjZQAWNelhOlrRfgAAAABJRU5ErkJggg==",
    cx: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABxUlEQVR4XmPgsO99Ltng81+my4mmWKLe7zcDg+La+8zai/+L5sVhKKAmhlsGxP8ZlFb/5wur+C/T6YKhkBoY1TIoZreZ+J8WwYrVMhCmNFijZzv8D51pjyKG0zJKg1Wh2+n/2Z1W/wORLMRvGRnBCrJk4krb/0lzHP6XLLT7v3+rDX7L2qff+O8QeQjFQuRgVe91AhsGotEtg8lv3GTz/+1Bq/8/jlj+V+7BY5mC7fb/HBobMHwIClbf4vT/Xw5b/v9/zPL/ls3W/0NmOmBYBsNbgBaC1J3aYfXfcIIjdsuQcXzJmf8SZlvh/DVTov8nz7X/HzPbHuziFesQwYSMLSY5goMQFJSwEIBb5p927L+Kw06slslYboPzF02J/L9nq/X/9Hn2/yettPu/ewvEMofJjuDUZwOk/aY7goMZFH/IDkCxzMRvH9xQDZdd/3Xcd2NY7uzT///zfrv/V3Zb/T+11Q4crMSmVpzByKO9EYzRxcFyGiv++4d0gmkQn9jUitMyUjExhQBWy6ILTv23CT2AYSBBTKAQwGoZKO5AcYZhGJEYV7BitYwaGFuw0swyMEYLVtpaBsWwYKWLZSAMClahlIxPAK08B+QisrUsAAAAAElFTkSuQmCC",
    cy: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABa0lEQVR4Xt2Sy0rDUBCGu3DhY7jwMXwEH8KFD+BKRNyLe3El6MJVcSGiUilSqBqxlgbRVCLUEEmJrZdqkibWpB35DzSYY9Im8QL6wYScM8l8mZPJEJFCv4OSwYXf/SH+uMy42iGrVuC3wffJDGmL1LVJMuUcn+oTX4av9ewW9bouW/dch2z1hBr7C3SzMkFadoo86z74UpD4MnlxjC5nMyTNjbB7aX6UrRHPlQ0mH8Jg2aOwTPXNaXoqrfqF+YDcNXT+1TDCZa3yOunbM58KRwWOMXVn+D98wbDAc23lkLodM70MYLL44v24XhpnR5yQaBm+Fv8KUkwaBBhrpy76E5mQaFnlXKBbreavMeZR4LnC0S6/zRMtaz7odHyap4tqmU8FQP5MLJKiynyKJ1oGqrLoC22nTZ7n+TnTemF5dIRTiMFgGei8vbKiRSHHxHdNjXWyl8+yfeRjMlz2EXQnlA5YVylIJvsi/1j2Dr6a+vUrPRhoAAAAAElFTkSuQmCC",
    cz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAv0lEQVR4XmMI853+7/r1F//pARjkZWr/8fCU/Z8y5TC6HNUB2DIGhvz/IOzgMPn//ftv0dVQDaBYBsK09CWGZbT0JU7LaOFLvJZR25dEWQbC1PAl0ZbBMCW+JNkyECbXlwySDMm/0Q0jhNkZcv7XMxj9f8LA9P8FAwPRmGTLjBnC/x9hEMQwiBhMtGXk+oZkyyjxDdGWUcM3yBinZdTyDTLGsIzavkHGKJbRwjfIGGwZLX2DjBk8GXy+0NI3yBgAPgJRjftY7RMAAAAASUVORK5CYII=",
    de: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAZElEQVR4Xu3NsQ2AMAxE0T8uCDFcZqBnA3QbwAgmkVy5jlNEKd41V3wAVTaA8IlHBuETjwzCJx4ZhE88MgifeGQQG5QDrmytw1OLlQ2gFeth5th3Ut6dK1vrYDeqbACtWA8Tx34Nt+ewIgKvcwAAAABJRU5ErkJggg==",
    dj: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA7ElEQVR4XrXQsQqCQBzH8RscfRAfwMdxjnanlhx9hmgXIqKXiASpraWhxZoMGkrMNO4XFwhnfw3Lu+G7/bkPv2PhIeXjGTCY6I+dryUvSo55CAyn9EBlbwycQ7Q/cYwCeqSqGibKHxzBih6qiGA6V7ZiOlZ+xVSvbMayjIAqVlIsSQDfJ1hVn5V1LIoAywJME/A8oCgI1mclO+ZxWXvMcQDbBuKYIFX3Zwb36MLYGmAb1j2CCUQsEt/ZAIW3NaydRR/qEsFa+nvNr1ivNV0xJWvk2jBla+Q+MeVr5GRMyxo5gWldI7e8LFKta6ReqIbw8SCsc1EAAAAASUVORK5CYII=",
    dk: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAY0lEQVR4XmM4xm1w/xiPwX9c+Ipnyn8YeLVkI4Y80RhoD8OoZaOW4cTD27JbiZUvb6fX/seFn/TOg1v26dg5DHliMcgehp9PXvyGm0ZDALKHvpbRNRjpmkBGLRu1DCce1pYBAPZPKeryEM8aAAAAAElFTkSuQmCC",
    dm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACA0lEQVR4Xu2UT0gUURzH34wzs2Gz+xZhKZCi1o3cHfZPbLobISx66GIRJGog1qHLnsy8RSgiwoqxiloUHUKwsA4h0U1MWAv/UCGlu6y25B/Y8tSlLhF+25kBD/N2h/EgXXzw4cebeV8+8978eMR5n8AK8UkCpAnCDQSEEKSys1BH44sYs7YUxPigFIcyM/Ytuxzj0SCLWJwePzjZQEJAPuZAzkcxkOSQ81NsRU6i966fWVsKS7K2uIRnNyU87hDw3etE6rys1ZFbIsZuiOi5foTJFIOoR2PG33c81msc2K52IhN0aJI+7yV89fuwGaDYUChyQYo/UwKTNUK+TROYkemy4V7h2D4rumj1DMWVxhiaT9Rjxm3XPqKvn8PbFhuTNULUzjLjSeVR7T9tVFNN9sFTgeNRDxSfqM1VvgTseFMlM1kGd+gUzHipuPC0RdqTqTs5G72IsjC/J3teeD+jVDBZI0TrX5Px81ECD+4IWDln13cWklFZ6wJfxyHlKRyj4sTYbQHZriZjlBlkbmsWZiy8n0A+6MJCRJeptJ2W4PYKeO2WMX9B78yPr5JM1oil1u9ot2E0weNTWBcuBfW65qUYGuQxdLWcyRTDkkxlpFvEToRqgsFhDulC/RE6huFOhVlbCssy9braXebQWleGa1TC0tRD7P7+dTDX1X+5iA9lxfgHNVAhMtnp1OkAAAAASUVORK5CYII=",
    do: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA5klEQVR4Xu2SuQrCQBRF5zP8BUv/zw+wtbEKpBELURBExSBaqCi4IYgLaBLBDQXjEjXG5bpUcTDjpLHKhdM97pl5PEJ8Anjxh+pFWLJNxstdr0fhhdCFLGiZFou0niXgxZW5Mib/lUUlucCLMt1VV2sNjZ4K0zRgzib9l5AXYn3pr+gnA2KyAqVUQDufw/V2oUeYcSRbbFTUUjFonSYyWQl7Q6NHmHEkO5p7jNICumERiazo/Gf0Xlmc5WHzfr3gxe2gYzzX+0Ji0OKF0BfDYhkMfFzju+DL1dpCF7JwZbbQhSxcmR0P4D5txN+sWrAAAAAASUVORK5CYII=",
    dz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA/0lEQVR4XmNgSDK+D8T/ScGh08v3/ycd3GcYtWz4WiYQbfw/09Lk/xYZk/9nRcz/3DQN+f+8Ycr/Px8+oRuKCxBnmXik8f+NQEsuCUAsq8lLPv/vx8//Px8++/9+1fb/f798RTcYGyDOsrmqEIsma5j854pDDUaQpSBMBCBsmV6AMdii00Im/0WiIWKZjbnHf9599P/Dxr3/vxw+g24oLkDYsggHiK+WKyKJTS47cMcl8f9lEfP/T0u7/oMsJgIMMsvoGowgDEsgXTomYD56Avn98g2SmTgBcZYhJ31QiqzPjL/49fQlcPC9aJlOXctAmG6ZGh3TvLgatQwPoK9lAFdYwk3VGdswAAAAAElFTkSuQmCC",
    ec: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADL0lEQVR4Xr2S/U9VdRyAP5MkAblc3+JcoMn1NagfuhNWHHuhlaKVTsGgm8iMvEtrawKSOTAXjnIk4B2O640XL1dAlEukpkI1rsm4sxdwi2kWCPmD5db4A5rLpwPkD/UlO27lD8852+d7Ps+znXOEGzJqwD1gVMYvUxz8H5iLjfULfdXC6UJh+KRw/fzk/IJbuHRU+O2qujMFd479fl3o2ilU64J7ucGf98oMDe8qoSrNODNwPyF0viX81K06TMdGvg7jSIWdjyuFy8eEnnJDuk2oeUpoyRP664VvmiafHfvOwa1fwhSH6diVkIV9BTaKXTNp9gkFW4X924VW43WeKBMGPhc+MoKf1M9mpMvOzZ+tisN07A3nYjLSY8lI00iKjabR+G7+Rp16n4uA34H3QyE+NYJ1KzTa65bS3aQrDtOxvVsSyc+Jw5mZRJo2HV/zaxwKvM2eXXYOnjhAoGMzyQ+Foz0WRU+bnbNVixWH6VhNUTwVO54kzbaK0pQIvrp0jcGRG5wMDXP0Ipz1+9irR7HekU39+ysJeucrDtOxds8DfJDnIF+y2bUplU+7ujndc45T3V00tjQRDPXRnBnHdsmnesvjjIZsiuMvsYSH370pc6uYCkdqHjucK9gmuXTmROIdLqDkcAO1/Y10UoLnyjv0G7/9eKzs9bUsf6ZAcdxmonOnWPIyF201OmvkTYLLBG+wlIbeMdytfRS6Wzl0pILBOGGjFBOoTedRvUhxmI7dH1tC7/EE7FLHRQmjtvRpDrRdYH9ZOXtezaYjZwFXjflCaeH7L+YzI65CcZiOyZxyPmudxcsv7uSFxCyKkuYRrIumsz2Xod3heOZo5Ekhuet2M9Q7V92/q5jBytVrCHgsbHI+z0vpSVRuTsGpL6XapfPKs4+wrySTXwcsZGVvVHaVWO/0B2/9KFb+iXMxCXy5KIpTCywczIqhZusS3kvU8BfrNGywMrBwJteSo+mw2AiKRdm/zXjnX2PjhCI1BiUGr9iIFD9DEo5VznBeFk3Mj0fMU3b+jqnYD9Nmczl8UnZGNFySYvwUEXjkOb6V+Im57z4rPdPU3buO/Vfc89gfhinR1vLIQ3MAAAAASUVORK5CYII=",
    ee: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAZUlEQVR4XmMQaHr8S2ji//+0xiB7GEYtoxQPc8u4Q6e94Y6a/5/mGGgPAxBcBeL/dMAge0YtoxgPZ8smTZr0evHixf9pjUH2MNy+ffvHfzoAkD2jllEM6G/ZvXv3vqJL0AKA7AEAYVtLVQffzPsAAAAASUVORK5CYII=",
    eg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABBUlEQVR4XmM4J6h2H4j/0wHfZwARWCRogUctowqms2U3XEI3XrP1O0wsvmrne+RCps1NdHFCGGQPw////+//JwH8+vb6/5NLk9CFiQH3SbLs6eVp/x+f7///8uby/8+vzQPzSQCkWXZrf+b/a7ui/r9/sv//ncNFYD4JgDTLbh/M+f/wVAvQRzP+PzzdBuaTAEizDOSTl9eX/L+5NxVM09Rnj85P+P/kwuT/L++sAtITgPE3AV0JPnCfoaKiYmNNTc1hYnFLQ+HJGRPLL4FodDl8GGQPAxDcB+L/dMD3GaAEugQt8H0GKIEuQQt8nwFKoEvQAt9ngBLoErTA9xmgBLoELfB9AF+typJb1c/jAAAAAElFTkSuQmCC",
    eh: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABZklEQVR4Xr2UMUjDUBCGD6lQSoYOWZ0iugQnJ+kiBDo46CSCQ0CEdhDUURQsItTNtYOj4FJxKaiodHBwcBE6dBAsWFAcnBwiZPi9NKQx75ka6YsH39G+/46vfS0hkwj0X3xwK4mHacEdHieMJoaq4d6TeXSYaXFAJdz7Mg+XWReHVME9Igs4Z3RxeFi4S6KA91wO1WIRtm0rYaCsRyYDVCqA6+LHOmsDcwfA7aOYSPW7LKBQALrd6PZpkzP+MKUj//1z53sqVXKZh64DjUa4bSwAo+P+6ys+X7Q4r8fewt9kmgbUauH25EYoe7gHJvL8bY/DXKjkMtMEWq3o9sUrZ1lgla/xha/40wGe4n+7ZLJyGXAccdevS/6DWPtAsy0mUg2UOVoW9b0lVG92lRAruxsjTK0R8tvqkGTuCOFwhp8eW/LwsERkbxphflkeUkVfdm0QjE15QCXkXduOJQdpQLMr8mFafAEb9CAr/GdjvAAAAABJRU5ErkJggg==",
    er: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACRUlEQVR4XmNYLqbzuMDf/L95l9N/5XluNMOmPU6/GfYxqN8H4v8gPF1D/39csvV/remuGIopxRiWwfB2do3/LdZG/73K7DA0kYtxWoaMV4lo/6dGMOO17Jiyxf9Tpo7/T2jb/D/ArfP/qIIZRcGM1bJDQgb/L4UE/H97svP/zZKE/8fVrf6/2FL//8WG2v/nvbzA8uQEM4Zl+1k0/t+uT/1/qzr5/1l71/8n9Wz/n3PzBMudNLL/f7ct4//9ziywT0kNZgzLQD56f6EHbNhBPr3/h0UNwYZfy4yGWwjyMcgxyKEBw/iCGcOyx7OLwEEHYoPi6OX2hv/vznb/vxwdDDcQ5HOQOLpFyBhbMGNY9nxt9f+zTh5gNsh3D3pzwIaDLIapAfn+zaE2DAtwYVgwu1XZf0ex7NO9KfAgAgXjaUsncLCC4g6m5uGUfLA6kDy6wdjwXmnH/zuz+/5vX3YMYRkoPp6trPp/pykdrAiUMN4eawf7BJQiYZpBakDBCEqV6AbDLeAy+L8roPj/9oUH/2+5/gWMt+6/gwhGUEoEufrj9QnwJH49N+b/k0Vl4KAEqQHF3cfbE+F8dLzbLOr/jrbl/7eefQ23BKtlIAyKJ5CFH670gTM1SAzkC5A4KC4/P5r6/8GEXFRfQINp655bGBbgtQxsIbs22EegjAzKV6DMDHIAKPGAxEFxhS2YCGGsliFjULw9mV8Kzm8gPr5gIoQJWgbCxAYTIYzTMnKCiRDGsIySYCKEwZbtlXN9TI1gIoRBlgEAYqEpQQt+0EQAAAAASUVORK5CYII=",
    es: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABXUlEQVR4XmM4xi13H4j/0wHfZwARWCRogUctowq+z/BzPfPv/0cY/tMag+zBa9mMUpb/ebGC//sL+f4fnoYpTwrGa1lPJud/cwXm/56G7P+D9Vj+10dwYqghBeO0TE+Z7b+LMeN/R13m//oqrP+dDFj/FwWy/DfTYvufEYBpEDEYp2UR3lL/a715/nfZcP9vNhb5H+Xp9784zet/Yqjy/xmV3BgGEYOxWnZ/NcP/qdH6/3vdBP93pMn9D9MS/18Qk/q/NCHsf2ek4f+5WQIYBhGDsVoGwq3++v9LvSX+1xhJAINS73++i/D/3lip/wuy3f73xgliGEQMxmnZ5Hr7/40JEv8nOPD9r/MR/7+nnuf/2myF/6tmBP+fVERly9qqNP/3lYr9n5Gv/r+l3Pf/tHK9/1dXSvzvqNb+P61GHMMgYjBOy2iBwZaBihEsRQstMJ3LRhCBRYIWeBhbBgD3Br3WxOCY/QAAAABJRU5ErkJggg==",
    et: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABXUlEQVR4XmPQ7OH4Ty/MgC5ASzxqGVXw4LRMpVP2v1Bl8X+e4nn/uYsn/xetSfmv0cONoQ4fZvh/TPE/IXx6i9N/tYq1/2VKt/z3b5/8X6R453+NyjX/jWuX/v98SANDPS5M0LLfR5XBBjNkH/vv3Dz7f/X0sv/xvR3/vdumgcUKJtdi6MGFCVp2fqvDf4Xyjf/Lp1b+L55S8795VuH//nlZYHb+pLr/CmWbMPTgwgQtW7MyDOwDi/pF/2cvSvpvULMcbBHIhyw5R8By6HpwYYKW3d5pAQ5GE2D8gCyYvzjh/+JlMf+zJzb+D+6YCIy3ZRh6cGGCloGwT9vU/xx5B/93z83579A0B2wxyHcgX01ZkIahHhdm+Jog/Z8Qvpeo/d8mZy48OEE0KAgz0msx1OLDDO8VJf4Tg18rSf9faeb9v8S96H+zU9r/fQbWGGoIYaItowYetYwqmK6WAQA5uKPZzu7VWAAAAABJRU5ErkJggg==",
    eu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABPElEQVR4XmNgMJ55H4j/0wHfZwATmBK0wIPcMhG73v8JuQlgGl2OACbOMmmXzv9HVir/l3dr+89jOfn/7W1iYBrEB4mD5NH1YMHEWQbCK2cZ/+cwn4oiBuKDxNHV4sD4LRN36v6fUxKBYQk6BsmD1IHUo8shYfyWybu0/T+7Vg5DHBsGqQOpRxdHwvgtozLGbZm4Y/f/ST1O/5U9WjDksGGQOpB6kD50OSjGbRkIX94kDU516OLYMEgdSD26OBLGbxmVMX7LtHwa/s/qtwW6ehKGHDIGyYPUgdSjyyFh/JZJO3f+P7BcFUMcGwapA6lHF0fC+C2DYQHbCf9jsxP/i9ijFlEgPkgcJI+uBwsmzjJQMN3fKfJfxqkTXCYumGIFpkF8kDihYIZi4ixDxzsXaGOIEYHJs4xMPIwtAwB1xdZoL48W9wAAAABJRU5ErkJggg==",
    fi: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAdUlEQVR4XmP4/////f84QMOsA/8ZTBtQsILfBHRlxIL7DCACXRQGRi0jEoxaRiXLAkpXfHHIWPAfGwYZjG4Zh3ULhjpiMMgeBhnvvt/oBtICg+0ZtYxSDLaHrgkElCTR0ygMUD3pgwh0URgYtYxIMGoZdSwDADtYYltWTxbGAAAAAElFTkSuQmCC",
    fj: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACe0lEQVR4Xt2TXUhTYRzGdxkmgVBhJNRFRJEhSCQGqUQXXQysrN2MEpSTJzV1m8720QbbclqkLHOl7qRbW45MY/NjflS2spkG7kxzbUasm4iIwqC7iifOgTNtjmPJoYsufufi8PD/ve/L8xeFcsUIHy7ELcNtbMi6ANEeksXV4cVs2m5E2xzxfwxkjRVRaTno9P242DMNcuL9nxITlSg6f0QIBYJb9mK+3oxDksaksowCFR6aOzC3KweRoxJc1VM42xdOHMhHTLQxV/l9c24thk3t7CDulm5qMC7jbsMcKFTXgOxCI3sA6f2FxIF8xEQW19OfXf0BMASmX+Orfwqfe/rxjV5gZZ8cvfjSN4il4UeI0ItweF6wWQZyIJI4kI+YiM7MZ4euB619MnEgH/9YtvIZ/YEwlp7PJH/G0QnMBxdhfzC1/meMF8Rsw/y+PN6CMHUP6prXX5CV1X9VreevvukmQjsPrKp+U9MdUFnb4TieBlfmDliztqHryFb05mTAprmxLGOX+uAxdJsopGZXr7nUSmU7oqeJ35a6qKgUlop8BMwpeHwpBX5NKmbUmzAgTkezrG5ZxnySXPmvIK7YoCgnYFIo0FV8Hs6TEnReu4wWlQaVplYuJ4ysyj6CgtITEJdIQNVr4SWVKFITqNTVQe30cTlhZIa7T+BvaIFP14BwmRbvpLVwy1VwydW47hzlcsLIjN1jGKnR4o2xFbOnKvBWXAZaZwQlJdBm83I5YWTnhiK45/XA4/EgZLXjY2MHim1l6HTWompgjssJI2NQel5iaGwcUcqNSbkeZ5pkMIzTKzPCyRhkzz7A7fDBqrOAHFy18MLK1uA/lv0C5Q/mpv0V9LkAAAAASUVORK5CYII=",
    fk: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADx0lEQVR4Xq2U/08TdxjHb4vJ3EIy/wCymOyXJiZb4rKtyZxpgihIgdFSvhhZ55cqUJSCmxQYpUtrppSC25VasNAxi4XarutasK6kyGoUKzJgZfUYWqyOkkClY5ht0ey93i00K5qoq5e8Prk89+R55fO59x0xJdyPFf8USNKDlJRDIIgDDD0qC0YJAjeaNfHaunWlqN+jwXRRMe719sbrT0mQyE1veugXiTGnVOLWjV+RlUU+VvbGJhmuShoQqqjA4kwIYvHZtcOeRJCILQ/oHXVKSMzw+Vi5cgUmkw+WL+2MjFJrcLKcxM3CQiwPDsLhmEBqas3aQU9DkLjcbvl72mQHzazZjnl9J5aHhhAxmRjZXakUEaMRSwPnEbL1M32rcNJawSnoejKxPkY2lvoaM/T/wNnZBqLaiyNd30Nweoy5fxxMHy37KTsPFIfzCAE2mxnoZ7EeebYKPaTOOonx8QkEKApVhos4oPfiw1MXUaL7ASk1a2T5+e0PhUIDqqrM8PlmmSMMt7Ti9qXr/x6jTo/79/9i6j83HIOs/hvQ/TSrO5MaLyEcDiMajSISiWBxcRELCwuQGK8mymLLg337uhGZnWOSdq2yHpvf/CwhjXQgzp27zgjpoGgOt2H9enFcJtAMg4rtLBQKMaJAIMBIRYaRRJnTOfnnPYsFvwgK0CjSMt8SnZ610afh83UIzYSZ0EyWSeKyV6VenHZ4of/WA7XZA5nRA/OAB6/LhxNlTSWf/9aR/wk2bqxNiGrhzmac5RRDvutEQn3DBglqaqxQHzwZlxH7VXilgIuXi7kgPngfL/C24qWiHXiRtx3E4QsJxxj877BnIT33FAy+edy6Ow9SlIOGslyYKzMh572LukoBlmLvmvTOIS1bm7wsFi4MTS9BohuAo5UPg5yHy6rN6DtWgG5FMSptN/HjnWWw2ceTl7FYMryTU40d1SQqDuaBl5OOupKt2J21BduFYmTK+5C618b0JS2j6XNTcJ8hofooA+5+B7oayuCy9qKznAtr3S6QfeOrvcGkZPQ/1e2hkEmOQVrbCAn3PZQW5UFfmgH1Xi7S1CM487Ur1idOXiaXG/HHyu8YHXTh7SYfcgVCqPZwITv6MTK+GMG1MT9GzHqIhM/hGKmJKQy6zqP301JYbKOg7kRBX/7bUdico+jvaoNu9zbY29TPQeZxwmnshL3nKyikR9HR3AKH9Tu49Fq0l+VDmf0WOsr5cJuNycu2sJUYcgxDoegB2dKObo0WHUoZjCcUMBxvRmOtHtomDTaxjiQve0aC/wCAr1I8Ffm2EAAAAABJRU5ErkJggg==",
    fm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABGElEQVR4XmNIn37tP70wA7oALTFZls3Y+RhDjBhMkmVVS27/P3j13f/P3/+AaRAfXQ0+TJJlILz88PP/P379/b/uxEsMOUKYZMu61z/4nzPr+v/+TQ8x5Ahhki2jBA8Oy0DBlTfnBjjI0OWwYZA6EJ62HXdKxWpZxaLb/0/f/vj/+fuf4ASBLo8Nz93z9P+rDz//n737EawfXR6EsVrWsvre/yuPPv//+PX3/9m7nmDIY8MgH4HUg/SB9KPLgzBWy2CaQcFYPP8mhhw2DFKXOfM62IfocjCM0zJa4MFtWdsaSHzAaFIwyZYtOfj8/7svv4hOpciYJMsK5938v+fiW3DZCKKJTTwwTJJlMEyOr0CYLMvIxXS1DAC1OwxFUUeQ2gAAAABJRU5ErkJggg==",
    fo: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAf0lEQVR4XmP4/////f94AIPF9P97tMz+X9fQ+B9glPd/wdYb6EqIBgz/Ry0btQwPoK9lp669fLr/7NP/uDC6ZRXTTmCoIRYzeCYs/CFt1vkfH96vZQq2LNEwFUOOFMywwdzzL8ggemD6WkbXYKRrAvlPz6T/f9SyUcvwALpaBgCYA+z/3qs4zQAAAABJRU5ErkJggg==",
    fr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    ga: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAXUlEQVR4XmPwWcnw22whw39aY5A9DKOWUYqHuWVd+xg+NO1m+E9rDLKH4f9zhvtA/J8O+P6oZdTAw9my7Pk5HxJml/6nNQbZwyBTtfw3Q+6e/7TGYHtGLaMUD2/LAAFQ2krOvKriAAAAAElFTkSuQmCC",
    gb: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABWElEQVR4Xu2UsWrCUBSGz+jo6GP4CL6Bj6BTcXR0EYQKLh106Ny9iy0dugi6tja9dCriECJFKbQ4FWui/OVcekO45uYmpu3UH35Cbs65H4TzHyI6QRq77huWnQ4eiELzO5/rtUaPxzNUKmeHHzTngZXLp7i6vAPhWzboMTAFee338VQqgbhht14rphGaBaZDHgsFLJpNkCgWwbZB08BMEH+1knfS5GYqm2zQJJgNwhJiAarVLtDr3eL5foZltwu3XpeFn/N5WMjy/V0sbLsN5KUvrZbs5WcU4nnvGAxGYE44IGkUB8siijb/tv9hP+K/HRAeyXb7Go7jhYf7zUZmhkfZazTwIQSCYB8L40hExZHh6HAvR4kjxdGSoz8cirBQQaLBFCMH1ep5Yqg59Bx+JV4K+qLg5SF/YxIky7qyQckGyQKzQckGOQZmgpINkgemQ0n/YHIemPIXeJAU1X4+5ngAAAAASUVORK5CYII=",
    gd: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACIklEQVR4XmM4J6h2H4j/Y8OXFFT/3/ZQxBC/FyGPIXbbQwmsHl0cCd9nABFYJP6fF1H9/2Wt5P/v+yT+X5RCGHLHTfH/79Pi/++4IxwBkv8BVPdljSRYH7pZWC3bGKz7f1MoAh/I1vi/L0MTRWxHvM7/3SmaYBpZfC9Q3f5sVLUg83Bapt8V8P/sQZX/fy6KUYxB5oDMw2kZQ1Xcf47amP+dK83//7ggjmEAMRikD6QfZA7IPLyWwbB5r9//G0cUMAzDh0HqQfqQzSHKMhDmqYv+P3GNKYah2DBIHUg9uhlEWwbDThO9/z84Lgc29NcJ8f/vpkr//3UaYglIHCSProegZTItYf97V5v+F2mIxNAkUB/5f1WH/v+Lsqr/n1fKgmkQHySOrpYoyxRaQ8GufX5cBmwxusaFHkb/P86X/v/nvNj/jwuk/s/zMsJQg45xWsZSHft/+wat/1v7tf/b9/tgaJxoYP7/RZ3s/z/nxP6/qJL932tkjqEGHeO0DCQJimTdpiCwxciaYMF4P1YBGIRq/x9EKVAWjOgKYRhrAjkByYdkJxB0hXRL+nTJ1KC4okZxBYtznJbRtSBGr2K2REKqGWQxEN6XroUhBqpeQOqJrmKQ8QVxlf+fV0n8/7lPHJzUYeK3XZX+/zwpDqZhYiB5UOX5abUUWB+6WQQtA+F7IQr/HyYooIhdVlb9/yhN/v8lZdQa+QFQ3b0QzOYCEr4PAFzKtExPbur1AAAAAElFTkSuQmCC",
    ge: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAjUlEQVR4Xu2Uyw2AIBBEtxCKsBgKsQQPFmMB9GMhHkbHi0FFNzEMF1+yJHx2X7IBDMAML8MAmB3BuZ/ZOJxXi1SR9T2Q0nnVJ2Me86/cyMYR6DogRmCasq1XGc8zj/msk9NaRmRtfMIjK6OWhbBkBWrF5vll32OXSS9Ic5nsUUu/K6mMyNr4hEdWRitbAa993KNntvmeAAAAAElFTkSuQmCC",
    gf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABEUlEQVR4XmO4eZFvq+IknZfsnQb/aYzvM/y5y3n/1x3Ol+FLlM9iUUBNDLEMiP8D8e/VB0T3c3fp/8aikBoYxTIwfn6N5yyNghXTMhCmUbBit4xGwYrXMjCmYrAStgyE0YPVKUML3SBiMHGWQTE4WAXb9X8fk5X9z9emj24YIUy8Zb9vcf5/mS38/7aKxK9bQlL/D8vL/K91U/nP1U60pcRbBsOPvcX+gyzbZSr7EYuB+DBploF898hF9P+n+Xwg+t/qvSIHSEitpFn26wrX/9/XuSAWA2kQn4TUSppluDB6asWBqWMZFBMqBKhqGRjjCVbqWwbCOIKVNpZBMXqw0tQyMEYKVtpbBsKgYE1cobAVANQX1zSeUILwAAAAAElFTkSuQmCC",
    gg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAwElEQVR4XmP4/////f9EgD8Pn/5/IaiLgUHiRIL7DCACXRQbABn6UkX7/5cFMv+/rpIG0yA+zSwD+eRjleL/n3fFwDRNfQYy/EO5EtgyED1qGRTQ2bKPpW0fPmbX/CeEPyQUYbUMJI6uFisG2sPwWsflN3K+eWOt8f+Nozqcj47RLcOGQfpB5iCLgezBtMxFA2wYpRhkziCzjJbBSNcEAkqS6GkUG6BK0gcR6KLYwKhleADpltGtiqF75YmOSbEMAGOxCMYxEyGyAAAAAElFTkSuQmCC",
    gh: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA1ElEQVR4XmO4oK7y75yg2n9aY5A9DKOWUYqHuWXXkhX/3o9S+E8KvhEujyFGCIPsYXhwTOr3n4ti/0nB5UlcGGKEMMgeki17sEvkPwMDA5hGl8OHSbJsVS//f3sTtv/aKixgy0A0iA8SR1eLDZNkGQivm8D/n4OdEWwZiAbx0dXgwiRb9uKgyH8WZob/EiJMYBrER1eDC5Ns2bxmvv9NOdz/v5wSBdMgProaXBhsWVS/wcu4iQb/icERHbp4+fgwyB4Ghmz7+0D8nw74/qhl1MDD2DIAQUaAVEduIEgAAAAASUVORK5CYII=",
    gi: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACKElEQVR4Xr2V30tTYRjHn/Kw2jn9mJo1jXASmCIy6A/QqybWzRKhKEi66kaiizDwzpuiqGmCBsmCQBDqIqicWG47OjSaZBRMcyUmBeXf4MW393lsBzzTnTOFfeHLs+d9nvf5nJfzHkYbv35voARiDhUDW/7yFZ9mUpZXMhl7y45yBfs29wHL4xPi5J1evPQHMFlzWmKyp9eq/UjP27dukSsYD3nt8SFJOtKDQxirqMEL8kqc6x+Uda7/XPhs37pFrmCsxIlaZOkQvqdmMVp1CgN0UCLnvM51J7mGPQ2cQffhShke9flRRfvwvLxa8ptHKhGta7BvyZMjbMmcxuLoGJ40BhE6WoHU/UcYOlkHP+2XaN57gDa1znXuY/hOcoStqNs31XIOr+qb8dBfi5g6wWTTWUw0BCWOqxNHqgNST7SGsJZZtI+w5AhjzXdekfciF0EN55gz5zNkSJ37CskVbPp8WIaxR7TNGC3bBORyNvcVkiuY2R5GHx3ABdIwrG7hbfJA0zSJnPM617mvkFzD2qgMRCTDO3RNYBw553Wu7xm29O49nunqaquPOKKePuItx+Om4xjpNHC38RgGVM7rXOe+bDxhH2FJYH+uXl//23UDTk6HL+Gjenp29FrA+r1w8XJe73ZmDmXJWM29ZDc21anetnoRD+l5tcI2VouGsWNdxYLYu4QluksAm/LomA0aiN0qAeyNT/3NdKh31lMCmPn/ZPH23cH+AauQ+7c8XU9ZAAAAAElFTkSuQmCC",
    gl: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABO0lEQVR4XmP4/////f/0AfcZQAS6KI3AILLs94s3/z9s2Pv/afWE/0+KO/+/Xbjh//erd9CVEQtwW/Z65sr/l8Rt/1/gMcbAD1Nq///58AldCyGA3bL7MWUYFqDjq+qe/389eYmuFR/AtOztks0YBuPC90IKkLUSAqiW/fv95/9laQcMQ/HhjzsOI4zDD1At+3bxJoZhhDAo8RAJUC0DpTZ0wwjhu76ZCOPwg/sMV9W9fsM0PspuRldAEHzefxLDAdgwyB4Uy25aRaKbRRC8mrgYw2BsGMOyiwJmJOcfUIpENxgbxrAMhB+lN6CbhxOAUiK6obgwVstAGFREEQKgDA3K2Oh6cWGcloEwqCz8++Uruh1g8G7FNpLzI17LQPiKshu46AIlAlBZCUqtN8zCMNQRgwlaRk08vC0DAOj2YHqnPxIeAAAAAElFTkSuQmCC",
    gm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAaUlEQVR4Xu2UoQ0AMQwDvWRZFysuK+gCDzqKR8m79FWYBLxq6UICTpGswAAKS4DY47CI4MpckKz3aWOscOSR0mg5IYCm0SwBXpkH/LFsV/Lb0aAQddVZnrKi2R5dpzfS9LXi4ZV5kCt7AU9KRaVvGmBmAAAAAElFTkSuQmCC",
    gn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAQUlEQVR4Xu3NoREAIBTD0O6/AdMxygfd6xGHqng20Uj7mqdhWmirMxLirjMW4q4zFuKuMxbirjMW4q4zFuLu7+wACraamTJi5b8AAAAASUVORK5CYII=",
    gp: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    gq: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABhElEQVR4XmMwmpDyz24Ww39a49AlMv8YuKt2/Nftt8SQpDaGW8Zatu+/+TRxDAXUxHDLGIrP/eevmfffdhYzhiJqYRTLQFi2NRdDEbUwhmUgTKv4A1smXHsQxTLuymP/K3bk/G8/kEBVPGVPxl8G+aaL/5AtA2GbKbf+//777z86OLh79v+TB2f8P3Vw0v9Th6b9P35oBboSnODP82e/sVoGwhVbn6Kr/3/x4sX/l25c/Z84o+z/1nP7wXxiAV7LQHjHjY8oGu7fv/9/3bld/2OrY/7PP7IGzCcWkGzZ5cuXwfS0tkoUPjEAr2XYgnHfvn1gen5v3f/Pnz/D+cQAnJbhSiDPnz//f/r06f8bN278f+nSpf/v379HV4ITgC2TLj70B9ki4eLj/y+XVP5/W5JHXVyQ9ZJBMnvXb2TLllh4/X+sKEF1/ERR4j6KZdm+FRiKqIVRLDNNWPL/vpI0hiJqYbhlQrkH/p/S0sFQQE0Mt4xW8YSMwZY1umS8QZegBQZZBgBsEUNsVmGU6QAAAABJRU5ErkJggg==",
    gr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABFElEQVR4XmPgiV3/mzdu/X8YTp919j8IPHz9FS5GLcxAV8sUc7Z+QxbAZ9nqE49vv/388zy5mEGjYAfRPjt0/TVYjlzAULvyys+2ddf/w/DmM8/AEh++/oKLwXDC9FNXY6ec2k8uZgD64B+aA3ACr7bDGL4lBTPM2H3n15JDD//D8LGbb8AGf/n+Gy4Gw7Urrt5sXnvtMLmYvnGmlLPtB7GWLT786NXdl18ek4vpm8/oatn1J58u3H7++TkM333x5cX9V19egTCyOAh//v77ye+//x6TixmAnrgPjT+aAwbHhgMbrWr2HaYHZgCG5X30sKUVZlh+5NG6daee7KcHpm+cbTv/bNeWc8/O0wPTN8546WgZAElSCnW5cv15AAAAAElFTkSuQmCC",
    gs: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAEUklEQVR4XqWVbUxTVxjHG0HeClpEtMFSXjJkUQS0BQpUoKUUaClILeUWCm2tMOR1GEBUGDhQHCGwBUwExYImOpQPU8kSo4kfiFmcUyK4VWHkLusyt8XA4oLMzfnfvcWC7bYs2g//m3vPec7zu+d5/vdcxoPcvJeLZjPM5scQCI6DwSi105OhIXzFYIDU65GS0mU3x+EcwLVjg/gylo+vP+lBeJgeq1ap/pHjlUjG4GHT00cpKfixtRV/LD5HT88NeHtX/S+scs9pzJSUYValwrWR0zD1fgBClgkfptIRsgKjL+LkTkw1H8NDoRALd+6AJJ8sJ3aEBQcfxHhHP77h8zE3Oor5+QUYDAOIYYch2FdMrdE4Quxh9IOHRwX6Dp3FtFwOS10d/lpchMl0yw420HkZM5oC6/2L+XlcvXrfWkp6PZspR2mEK6qj3ODhSjiClmC3r9z6fXb8Hmyy3J7E3PUbeDY1heckiZ+6uqwwulz0rn8bH8ezb2fx+O4DXB+5jM/Pj4L84j7OdfcikRuO5IAt4PpIqApUYceOKri7G1dgE5zAl3Syt9EEh4N+rRbDDU1oWecLdfxOJL+ThM3sTJSVfQQ/v5XeOw2jdZGxBkX+RhTvzIZYuAuJ8TkIDS2Cm1s/BTDYw2ZODr2g+/Jf+m7vXmtS2jyOc+YTJzDc1o64qCLUEn2QS+UoJLSIjByEu0snBBEbYdTzwFqrX4IFBR200A6jRRADsFjmsDAxgemMDEyfuWBnkMnJH6zGoQ00oy1GY20fdu3Ow9YIJTibkpEqliI9TYbobbuxwUcFYYIYwUGbwd6oXYLRFxbrfZw6Nb6c6FF6utWZtEMdra/Tmax2/3VsDP0yGTTFOqRJiyHNzYVWH4acmkjk7yvA/v1nUVJxiIJ42cpJMtTqgZ/p3Ty9eRNmgQD3PuwGn390udaOMHqMza7DpUt3MXLhUwji4yESi0G81wjiuAuyOhgobmpDPtGOqO1xYLFY1BrFEszy0PLn95WVmM5VoqP2DFxdy15v6r/CaDG9tVCqNZArspEuo3plbEBmYygkB5ho+PgKNnGMSEhMpl6MTcVnvdoZr/6XIl6NtWevQ2xSJLTAGL0P6tgG0OW2jUdtV1L9UlElVECTlw2Fphyy2lqIS2VIJZrgt94AorAaaWkZVLz1IyeXT5A3VSBXDVGqBFJRIhTCd5GXEoG88iPY09yL8opGGApb0GDQISAghIq3Hs5vD/N0V0ASGwWRgIc0wVakx4RinZAPr5I4GNpa0Nk5jNb6NmRnV8LLiz4znYDRYq4ugM6Xiw0sCbj+GZDyI6AWhSB2Cx9rmWpIg7YhwyPGFk86BeO6ZkFOnYdj7athql+PIkk0chLiUaMMx2dH3NFhWINYN5EtnnQK5uKSj4uH/XDS4AFemNBurlnliW6dJ0TRSbYx0ikYrWCvJFQHhoDjX2g3rgznIc4tjrpf/pmSTsPeQOTf7DP8MTjTHNoAAAAASUVORK5CYII=",
    gt: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA9ElEQVR4XmPwnH7hPhD/x4eJAeh6sOD7DCACiwQKJgag68GCRy0jDND1YMGjlkHAo2f3/9+4e+X/pq1z///58/v/1v0baWPZrsNb/tf05v+/tK/1/7xpsf9nLO/4P2Fe8/8zl09Q37LlG+f+D81y+f/g7u7/L653/q+dnfo/MMPh/8K106lv2arNC/97hZn+37Kk4v+pg9P+bz2w5L+nr9H/6bO6qG8ZCLRUZP4PS3b7/+Xbp//5pT7/65vz4HLoerBg0izbd3zn/7krJv1fuX3B/wkT6v9//PyBdpbhA+h6sOBRywgDdD1Y8KhlhAG6Hiz4PgD9G2ZkjOCt+wAAAABJRU5ErkJggg==",
    gu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACMUlEQVR4Xr3V70sTcQDH8f0rEeGjEUEhtgcVRinc5tKrq2FY2oOiIAmCCiKxEMHqQlwm/iybw839OJ3tct02bOp25xyO5VoYC8yIeiBlkQjxaXeSVF8c2xfswXsPdnzuBXdfOF1QV5LNhf9QVqf+XDBcA1PVsW2p99/EasvvwGAZLCgzw8NawuFo9SPi2lap9y8aUyH7nlOYGQvDsZMpGCwa+w3JrxbBR0cw6hvFyC5jQWBRmMnYDs+OCsRSGXTIAuqeNeHWZB9eiBMaeOhEL7Ghxq6XXsZ0vxc9cyJO+25in43T0MCbBURud6L+cDOxocYG9BuP7+XiW9yNOsC5GtE169ewmDQD6/7zxIYac++1QHm3rOVOxSCEvRq8+Z+eJTZU2MkjrfCfa4KSzEDpdkCxCZAEF+ZCUcjN7Ui+/wj/wbMoZ7uJbdEYW9kGkbsKJZNFfEyC4hQxJbiRiMQRf+LB/NIGlu+QFIypeXez2uP6tPId6Q+f0Tn+EL2zIgYSEvoSAQzrTcSGGhs2nMG4ksLK1zWs//gJKS3DGbDBlZyE1/EUQ9WXiA011sLcwETPY7glAXafA0LQAzHiQmjajtetV9DWyBMbaoypsSJqqMBqtiv3jsJ4np7PHYwQviTuYaqsEge4fmJDjaldbOARKjNjecmJ9bVBrCbvQzHWoKo+P0SFqTXU8ogxLL4tPIBsPg6mbusT+GdUmNoxE4+hUkveo/5v1BhNf2FB8hO+HWV/AVuA0t8DavswAAAAAElFTkSuQmCC",
    gw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAqklEQVR4XmM4J6h2H4j/48Of10oe/nNR7D+F+D7DqGVYNJOKR5JlJwRV6GdZMDv//yMCqBbSzDI+Rqb/jVwStLNsH7/yfwtWrv8sDIz/GRgYwFiYkeV/AzfEUqpaBvOBDSsP2CJGIN7Krwj3mVqL82GGeZ7/KcSolskzsf2PYBf4L83E+r+OW5x2lh3iV/k/nVcGbPhpQdX//TxStLMMHx61jAAetWwIWgYAzESvHIyVaLkAAAAASUVORK5CYII=",
    gy: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACYUlEQVR4XrWVXUhTYRzGx2Z2rDPPKkkjdcYEA1mQhVhEhZBXkX0TJOKFd7kLk0KpCwPJJKgbU6QIc7gCC6PWB32SRWPJrJXiQPQoZSrVFtM6pNTT3uM5ub29ubNVF7+78/5//M/zvOfobEfLpYbblShutWBDI/c/EXW2PCOyMnh4u5vxTLyFqpu7sKmJpx/8F4i6F9kCHCt4WIx6OFvTgUAd/MFXaPOcxj57Ln3gbyAyE4ZWmeDOTMb6pATUVSUAIg+M7QCmOtHz9hFq75VhS7OJPhwrczLCQJYJ+42JKNlpgNTPAUMhRsyA/zi+THWj43UTSq/k00O0EilTqU9ZhI1r9RhzL5wVqrwvCm3bAd+ECw2PK7DtfCo9cD7YMoI9jcfqND1eOhMjhfK2K4GPlZiWPHD2t+FQZxE9mMWfZYT76UZYjQZcb2EIVUY3A5N2jPi9OPf8GLZfNNMSbTKCJ1NAAacUhxaFM5wqb/td8uLJ4A3WFYouI5Di7OGp4syHvO1lTASH5Su0+1KOdhnh8BIOWwsYpWGhFOnbTAB3fQ410+iyXrOA4tBWFaUGzAwwBquQ0nyqBqZ96B13y20tbEnR/hq7MpJh5Qy4cGrB78N/bVEob/H56yjae87ioGMdXYzoMlL9nOV6uK4xmhhWBvI9rblzgC4DC7asZmkS8q2MfJSavwv0yTWP8U8RKVPzKdsb1jplixgvMIs5mZpP4wklH2WLvvGnrLDjYVZG8rEs0+NBuwB8sCE42RUt7HgQdfVrhB95uYsx+OYkXOJVrWHHg6irri2Xzjw8EmvY8SD+BD9pl/cns3+kAAAAAElFTkSuQmCC",
    hk: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABYUlEQVR4Xu2Sv0sCYRjHb3DwD3BwcBBx10UQdHdwFHERHB2cnfwD/APcFHR0cHBwECowMhAVNSxKcjjoFCsjSSopqW88D9RwL8d7wuXkwWe4e573/dzzQzlSFOwLRf/hPznI/ugGg3hqNnHu9QoxGTvJSPC93WK7WmEQiQhxGTvJprkcPpdLll3EYkJchlQ2r1RwVyhwJVTZ62SCx0YDHZ8P69GI5YtqFS2HQzirRyp76ffxNp1y+2hel8kki9fDIT4WC6wHA4491OvCWT1S2VUqxW2jC6mitseDbiCAXiiE22wWz60W1HzemsqIcSLBM+r4/Tix2zGOx6EVi3hXVZw6nUK+EaZkxDAa5ZUn5uUy7ms1lplp3y+mZGcuF7eR5rPRNNxkMjxLeqcF0ecbYUpG20jP12aDWamEY5sN1+k0/wDNTJ9vhCkZXd52u4X5UIW9cFjIN8KUzCoOMkvYq+wHwiwGoEYaqwYAAAAASUVORK5CYII=",
    hm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACvElEQVR4Xr2VT0iTYRzH34OHHUQ8ePCwYAcPHjx4MJQQGU2b5UFj7NJF0JBA05FmlGsbDGXlcAQTLIVVrDJXYUrsoGQX0cBaDVFm5kMbzBI2Lf+l2b71e9de9P1jMaHB5zk8z/t8v8+f7/MbN3vWmNien8fERAgazVVwXIOA1TqCGY5DSKtFba3nwNiJ4i4E261YqKzEg+4nB8YUYNzNlv61RYMByw4Htta30NrqQ0bGBUWzzMyLGDDf5U1W+vqwurqJ6upesbAcjKMmP9+C19e7edHNQABTUx9BfWKzipNOzJnasVhTg51IBD7fG+TkXBKLKsG4sjJnVKt1QqfrQb/jGZbq6vBtfBx7ewkEAmHBLDgdQthkQszrRSy2CYtlBDSPoIXJiIthXMja9TNqs0EJMgtqNJL+/TxtdoiF5WBcQH0sQYJHYaz0jCCq19/ij1/WLHi8OEErV4LE3qpUkv79+CvPCaIu1zifbJWqUWrmdr9c83gmQQwNzSAcjmOHMcQHB7G9sc2b0Z3t7u6BfqvDw5h9PgGvd5qfQ9TX3xNEKa2E7M6STQM/gWK84nYjpNej9/IA7PYXgllT0yM+fZRCSiOl8vQpl1hQlj/mjMvLM0do2/SwF8rL8e5aJ0pKkhcujj71GQx9iETi/M6p/7H5DrKzTRKDFB0dwxgdfZ80W/rwZfez04mFqircaBkQHrSSGUHidHw/YjFsTE7ilblHYkKQVmPjQ14nK6v5E9em74hZdSYUFNgkHxcW2uEoPQ9LRSt+n4Bk3Gi8jWh0DTbTfcmYDEy4s3Sh1e8/jRT02EW1lh3ZTAk6lf9mJgOTmNHlU60rKuo8NGVpwGTNlpe/Yn39O3Jz28QTjgKTmFHq/P5Z/m9GLqF/I1UbZULDJGYE7UitviL++J+g2jg2NidfG5ONdFK6HFYbfwH9aOD/lHT6jQAAAABJRU5ErkJggg==",
    hn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA0klEQVR4XmNgKD5/H4j/0wHfZwATmBK0wKOWUQXT2bLopQ9exi9/+J/WGGQPw+MPv37/xwFmnnj9/8TDL+jCWMFxoLpZJ9+gC8MByB68lhn13/gfsvAeujBWELLw7n+jvuvownBA0LLff//9//77L4rY1Rff/ltPuQOmkQFIHUg9LkDQsjtvfmBYBuI7TbuFVRykHhcgaJlh343/YYuJC8awRffB6nEBgpbdePUDr2uRAUgdSD0uALaMrkkfnNkwMyAtMJ1LEDCBKUELPGoZVfB9AMjn5UQI7EIVAAAAAElFTkSuQmCC",
    hr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABm0lEQVR4Xu2SMUsCYRjHb3SplkiIEKtP0BpUSlHW1iAODp5oIEdGHdHU4CAlJSUdWEOIEZEUhENgYFEh9AFcmsTNcC5ouPJfz11i3JnvmxQ09MCP93/P8773uztOeOmz1SAI+G3II/x52XN3j6nHgltW8C3i3uWBPBzDfiiKka0k4nIKs65jFGe8uBXnTWeMcMnUzi4MbaTglI+w2uGGOKdgatmNYMAPz/gEptNFjG0r2j7j2W/LCPfeHfpjeazbfJD9B3ArSYQChxidTODGG0Q+qpjOGNFkT6GFV4giWnG/ruBy9wTqkgxIEuDzaStdU5/mxjNGyCNUKo8qWHV6qj/h9bWOMdOcUeThk+VyQCSiE483ch2aM4pfVijoq8OhY8z1eYvil52dAXY7kM3qUD4/b2SaM4pfRjelt0indeo5k9EzzRnFLyuVAFVt/hmpT3NGaTJJylfD4SuweIgmgMQH9Dt/5OrajmlvM8gjWK3J8jtgMdCr4G4liVruArBYtJWuqW/c+wVlbtlnnIObph4H7cna5F/2I5TfAPahWAG9Re/bAAAAAElFTkSuQmCC",
    ht: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA/klEQVR4XmMQl5v8m0Fh/n9aY7A9o5ZRikctowomyTL/1L3/6/vP/08qXPg/q2j1/7jcWWA+SBxdLTZMkmXzV9/+f/vWjf/lrVX/pc2V/tf21P9//Og+WBxdLTZMkmWdk/f8b80p/p8aHPG/Mtv+f4p/yP/yuEywOLpabBhszyUB4/uXBEz+E8K3Jsz5725n8t/WUOV/lrvqfyst+f9OFkb/706ch6EWOza+T7RlPRnR/60dFf/rqgv/zwo0/a+pwvff3V3pf39WGIZa7JgEy3J9bf/HpPv/zyyO/R+fFfQ/oyj6f1xWAFDcDkMtdkyCZZTjUcuogkctowo2vg8Ao48WNLEAwg0AAAAASUVORK5CYII=",
    hu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAXElEQVR4XmO44W3w+4qp2H9aY5A9DKOWUYqHuWXPuyo+PGnM+09rDLKH4f////f/0wfcH7WMGmA4W9azN/tD846E/7TGIHsY/GbK/LboZfhPawyyZ9QyivHwtgwA/q+Qxj3YHzsAAAAASUVORK5CYII=",
    id: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAQ0lEQVR4XmN4ziB4H4j/0wHfZwARWCRogUctowoetYwqeDhb9u/L15f/6QBA9jAA6fvoEjQC90ctowYYtYwqYBhbBgDyZEGN3275CgAAAABJRU5ErkJggg==",
    ie: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAS0lEQVR4Xu2NMREAIAzEKgRDiEAIDtCAAEx2gD0D/MT0ucuaRFktY9Z9U6LH3VEyPHvCOPVMgnHqmQTj1DMJxqlnEoxTzyQYp79nB5kJ43zbnaqRAAAAAElFTkSuQmCC",
    il: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABJ0lEQVR4Xr2Uu2oCQRSG5zmsLcXSwnYLH0HQci0EF1tbKxstBVvfYEtLC0ttwkZyEe+iooGgITG6JH+YKYZlXOIZxfngb87u8M2cOQyDQdh4fISpMMZ6MJezwh1TLi9hKky9xEtstz7q9Y1aJqEtKxZncJyZuHBdSLJabS3akM9PkUg8oVRaIBbry/a023t1SSgkWaWyhOd9wbYn8P1fUWs0NkKSzY4wn9NOSZIdDj+Ixx/huu+yxqWp1KvYCBUNWR+t1k7WuMyyXlCtrgN//g9Jxnff7X4inR7KNnIJl2cyI6xWJ2VFOCRZcEAikQckk8+IRj05IJ3Oh7okFJIsSKEwRS43wWDwrX66iLaMt4yf9BpYs/kGUzH7EJ8X7hj+CpiK9oDcwh/sVfyqkW8KUAAAAABJRU5ErkJggg==",
    im: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACAElEQVR4XsWTT0jbUBzHA3pScUIvpbCJiAy9iYK9TKin4i5ShMLqwT94ELqDomwKCttFb+rBizTtartGMW1NilaTiYqom0K1SEFh0GkvgkiPvfldEsfEl1RfJ7rAhzx+7/d+n0d+vzASw+C5YMjAU/L/ZSGDmApre4OY06aLqwQMYiSGMn9dHZY/dGjrUHk5Nt1uHMRiiIU/IpXcwmJt7Z18eZAB19mOL+/sYN+2aGfImnllcYWFkW58nZzEz2QSqVQKIstC+PweicQeEjMzd/JXXxRD8HrB9fQg2vAagkHNvDKVwEsLWLcDYlUVuD83Fa1WpNNpXF1cQCgt/Xsxj92OdZ7X1SDJK1ssUd5tDIJFt7Hp6kqc/ToFri/Bd1kRYW76uxMO4zAY1NUgySszQhgewL7UjzWuGdlsFsc+H0L19ZBlGXxvry6fhFq2MzoK9VH7F/W4tHUul8PR4Tfsbowg7nDozpBQycTWVmQyGZwr/ToaH8fUKzMkpxN7ExM4UT7hj8AYViwW3TkSKtn3yCdsy32Iu1xan8h9WqhkXFMT+NlZrEsSJJvxT00DlUxlyWTCvjJxu8owyBUVENRpNci7D2qZRlkZFoaGsDo9hTm3CdFig5x7KEym4FcGQRZF+M1m3d5DFCyLtDXD096oi9NQsGy+puafJ7Jg2WN4VtlveKL21rRxR5wAAAAASUVORK5CYII=",
    in: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA2UlEQVR4Xu2SPQuCUBSG79beX6nVsX/kP1AhcBAJwpagWRcntxbBPq60C8UdbXM0kHjzCC2XMgV1CF947nIO57kcDsNmJkowAILR86HQB6OsE4aWHVc++DrsndLDAAi0SBBcYRgRLIujKJ5yuS6ilUxV94jjFJzfS1KY5kluqUtzWZY9YNscrptA1w/wvASOc0GeF3LrtzSX0VAaThJNiyqpbZ+rTzRMcxmF1kbre6+R1toi7WR0EHQYdCBBcJPLvyLYYqf4ynYe9g152HQ5ESUYADHKuuCPZS9ER7n6wr5vwwAAAABJRU5ErkJggg==",
    io: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAE6UlEQVR4XmWUf0yVVRjH3z9cc80Ga0askQNyBQwWsZsyJAKkgCACLg6UHwOhjVuQTGD8CPDKr0vIb5AwwCGYowsFNCAIkhAdhdVdyUQjdkEsVCraqHQw/Ha/B97r5Xa2s3vf97znOc/383yfI32fX/7wxmfD8PevgiQlQptVj5ve3rC1zYKlZSraE9W4U1eP0rwuTE7OwXysrPyDmpoRMfX6ZfNl8S4vrwfnz09CsrBIeVgdU4jbpyqhbR3F5yeaxGG5sVW4mV8EXc8Y3N1LRCKcTIKbE/KOIS2/USQkr3Hy24qKYXR2TiEiohE7drz9aH2moAS/qdXGqY+Px0+2ttvecQ7VadHScgnOzgVio0uQP5wCfBH0ZjXeqIhAdV8L1Oo+WFsfNwbfuTMZyckd0OluYWLiZ0jTIeFCiTyvu7pCZ2m57R3nsPo0zk2cQ25rLgaHLiOntRQeh15B0oUkvFrpi8lvdQakK1hf38DY2A2BbXl5VaDkYaurDyA5OuZvqFQdWOgbwnRJJSbKW0TwtrYrWO7pw0jmB9ivKMSuXe/gZZ9s2Me6wC/jdYOSGriGvwiLVCtY7vOCQ8g+2B6IFAhnZ++KQ4lSoSgSKgXOrqYvsFBSBs2RYvHC1CB79+Zg9JNxzGvKoVHVQaGMhvSSEx7zsIZDihMOHvfFniP2IgFlRibcPTYRm05iJd60tE5I473f/D4/d0e4hnP6hzk0FmmhVDYiOroZo6PXsbj4J0YujyD1bCoy2wpw4L0gPBVlhdfSfaHUHMK91XtG9xEhA9McREmF8pCmpvS/xsQ0Y/fuY+Avpd+/v2b8gIUNDW2AjU0GUlI+RkV3CxRHFUivSoePyhOB774Fd5UX7AMPIu9EF2Zmlox72RZlZYOCkp9fJSQbm8x14iNbHkjptLOnZ5mRN+vF/8/YpcIuzNlQu8NITPwIbiEu8FTGwSMwBfbBCjzpGC6+d3VVIyCgWriRz3QwD5QMJ/8hN6NcVG/vcnEAeTMzZsixsLCErJxasZkJRgb74mT9aSMqnW5WIGRgrpMIychDWlvbmO/u/k4g4kG0qOkgUjozI0Mr6icH1ut/QXtxnLB3cXG/mLS4+SBWJsAeldzcCh+YuofS4+PPiuvHvEk5razCEBkUgNL4UOQm2CLSVQl3hwTjOlXzhmHw4ODa7e708Tn1b0PDReFEOsn8iuH1Q+V0JJU7Osbh8B4LtFtLqPV6HANPSLjYeFIoYIKiNlt7WXuqYt9RtUQiREdEMkKiGRqaNl68S0t/CfYywu7aF1CreRYXmp7Hlx02GP80Fteu3RZr/ObqVT16e3mjbNaaIhhDSk/Xrsiu4S+lUwGVMEBSUpvRVXQrnwcGrmBkcBDdrR8aUDcbUG+S4CVAhFTBhJuavoaDw/uPMNL67AGipGTzW5xIo6LOiHX2oYz4uaePIszOTXxP8/CaYrtsq9FWAlxjEpKB56LQujXoPhaX7szO7hYKTQefuTk1oQpnVHH/cy8RMjAJEKXpkAy1WWI/sK+IkAeZBujv/1F0PxHSpXxmXf6+ewuXNHECFbPnpEJT+7NOTFi+JARG1oSNLDtJvjEYQHYVD5QR8+CggArsd9qsJevC7+XaMg6Dy8jpaFG7hoavlpmBqRIqZX/xMNZKviv5SyXczIOZoCkqWQkDc50kTJX+B9L9blNBQLqWAAAAAElFTkSuQmCC",
    iq: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABG0lEQVR4XmM4J6h2H4j/0wHfZwARWCRogUctowqms2U3XEI3XrP1O0xrDLKH4f////f/0wfcJ8myHbdO/v/+++f//ffO/X///TNY7PXXD/+vv3r4f8WlvWiqMQDxloEsOv7oyv/7757/n3tmK5gGgdtvnvzP2dT/v2HvPDQdGAC/ZY8/vPqfsaEHbJjD7Lz/CWva/tvMzP6fDhQDWf7775//ESsawGIl26eCLcYD8Fv2+ee3/12Hlv2ffXrz/wVnt8Pxnjtn/x9+cBEchDAxEP/yi3voRiAD/JZRGdxnMDc336ivr3+Y1hhkDwMQ3Afi/3TA9xmgBLoELfB9BiiBLkELfJ8BSqBL0ALfZ4AS6BK0wPcZoAS6BC3wfQBWZqc7+tt5HAAAAABJRU5ErkJggg==",
    ir: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB1UlEQVR4Xu1STUtCURC9/6V/URuLIOlTqWWFWZZK9AFta9MHlJRShoWZgbiRsLL2LVpo+cyCaNEyP3g+iaJAF1mnOyNtWsQTypUDw8w598ycdy9PNAUNqFeKn8R/ZsPsT1L0xmzoOraiU6b5dAKEKfvPHBLbYTwawcCZk8/bo0PoPKnqOo4sPEdao+y7Y2Pc04wpVt1D2vboIOuJF4uXm9i/i2Dpyou15C620yG4FD8810FspPawnvJjJemDOx2QdQeryg486SC2bkKYj7uxeXMAdyqAhYQHvtswQvdRifexruzBJzWupB/u6wBzAjXE5/s7Ks/PeA2HuRKuJXSbfcjlT8vLKJ2fI2MwcCVMvN7QbfZ2eIgXrxeVYpHNqBImXm/oNivH43iLRFC6uKjeTFbCxOsN3WYUFVWFarEgbzZzJVxL1GRGP0RZUZA1GlFKJPBZLv+U/Bqi4HBAm5yEOj4ObXqae+KKc3NciedeVtVmQ3F2lnnSEv6ep3Oeo/OpKT4vOJ2c3/Mi29YGzW5HtrUVOfnFBXqmvj7kenqgDg8jJ/tMczM/G2kzLS08SLd7pF4a0ixptJkZaNIsbzLxjoLVioyc4b2joxAPQqBe2TD7k6yr2RcJfpUtCileLQAAAABJRU5ErkJggg==",
    is: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAeElEQVR4XmNgsJh+H4j/48IgcF1DA4y/njz5P75pH4YaojHDqGWjluHDDPS0zC5jwzOHrI3/cWF0y9oXnsNQQyxmeHz5zu9fT578x4dhln3ctg1DjhTMcNPe8R/MMFpj+lpG12CkawJhoGfSZxi1bNQyfJiBjpYBAJ6KsH2nyl/kAAAAAElFTkSuQmCC",
    it: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAWklEQVR4Xu2NMQ3AIBQFv5A6QEAFNGHDALIQUEldKoeB7pcXYOr0Lrn1Lo679mh5zNzhSefU9yo9PFvBOPWMXQnj1DN2JYxTz9iVME49Y1fCOPWMXQnj9PfZBz0LqcAuiND/AAAAAElFTkSuQmCC",
    je: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABhklEQVR4XmP4devef5LB3w/oIgQByB6GBxIm/9+3Tv7/78cPdHkMcPfq3P/7ds38v3Nt4P/1q/v/P7w5H10JBgCZCzL/gajBf4b7grr/Qfixvvv/r1v3oatFAZeOlv4/sFT3//Jmw/+Hlln+v3C4GF0JCgCZBzIXZgcD2Fag72ACL0Iy/v+6+xBdHxisrSn/vyVW/P9ad6n/q3wl/x/qbkNXAgYg/SBzYGbCQo8BnyR60LbHxP/3V+b+P1tW9v8UNbn/68qKUOThQYbD8WDLYADd2+hBu6d/yv8Cc5H/i5wk/h8Ilv+/u28K0XpBAMUyEMDnutfPX/yf5KX0P8+E//8SO20wn9hQAQEMy2AAlyHXt+36/8Yu9P/1zdtxOgoXwGkZDGALnkt1nRhi6EGGDRC0DASwBS2hIMMGBpdl2ILxw4S5GGIUBSOuBALzBTbfkpxASDWEkKOQAUmZGh8gRi9JxRUhQChUSCqIiQW4HE9SFUMqQA9akipPcgBK5UlWs4AMALIHACMROaifwAbyAAAAAElFTkSuQmCC",
    jm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABCElEQVR4Xr2WPQrCMBiGv1m6ewAHFxfv4R16FM8hCAU3wcmti4NOolsPkEk8gKDg8plXbWnSL02UNoWnEJq8b/vQP7ru6M5n4tuRON0Q06I7kIdc5KOH1JaeGJRkOXGybC78BaxHTj0XPTQd06VYmweKA/Fk1QwJAeuw3sjT+eghvalkoM9kbk74R2tdW2VK5yIfPe8yDQaczvTkvTU592uVtCEHeWV2owxMRp/LNjS0aHVpQ049VywDoVo92mzkshKX1mEWpM2mvQxIWh8nc+zQZuMvA5LW6krd2mwUfXf2AYNoZdE0RrlBJG293PqStl4eape2Tl9Xodp8eLSquJ+YqB/PmL8FL/wJxSKmPeJ0AAAAAElFTkSuQmCC",
    jo: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA4klEQVR4Xr3WQQqCQBSA4bcwEleFGwnrBIEewDvMEdxHR5iLdAYJXXkBD9DOdeAyWqWrFq+Jeht1cKZmHPhBFN7HiANCCdAxAIQ5agCe4govIusoYZRVtI9RVlAZRhlFpzDKCPrwvO49TLWb77dnxmrOeaUbYBgq7WxQHCMWBeosOea6w3tjaaDjWJIgZhliEAyHy1JAx7E0Rczzz4D+M1k/Y44z42tUSQOhBffVQuvTv26WLT/u6iiLKt2gWSse6q041AdxME9/NIUZQSgZZhSh+pgVhCLMKkKVe/FbYBv59gJQkQB0JxM0XwAAAABJRU5ErkJggg==",
    jp: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAApElEQVR4XmP4T0fAgC5ASzC4Lfv3/fv/H9evg2lSAdGWfVyz5v9tA4P/V1hY/l9mYADTID5InFhA0LJ/v3//fxgSArYAFwbJg9QRAgQte9nQgGE4NgxSRwjgtezn7dvwYCOEQepA6vEBvJa9nTIFw1B8GKQeH8Br2ZOUFAwD8WGQenxg8FhG12CkawIBAbolfRCga6aGAboUV+iALgUxNcDwtQwA8b1oCPX+o/gAAAAASUVORK5CYII=",
    ke: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABMUlEQVR4XuWUIW/CQBTHTyCqJklFBQ0G2QS5D0DSgGHJFjAEg6AJFo1G8AH4APUVmM5tfmb+JvgWiLf3f6nhcWHXMMgyLvnl3fvfXX8JXGuiKDoYY+jaiOe+ZUmSUBiGJzlAjnWda7xlQRBQnucybzO7NJWKHjnW9RmNtwxkWUbdOKaCH7zfbqWiR673uhAPEVnyHGW/T++tlshQ0dcY1ryxsWTzTxTMppp/rddS0SPXe13A4y1bMcNq/sH/GSp65Hqvi1qyOfNYzT8nE6nokeu9Lv6u7KY/469cEFxJfUddw1pLr4PB0dVHj9xzWBMt2TjjF+8cU/5kLRLqPDepeKheaq7okWP95IxCPD6yxrhBvWVPHtp+4s/VSyoVPXKs6zMab5kwcmTnckU92YX8b9k3UcB9gznwT8IAAAAASUVORK5CYII=",
    kg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB30lEQVR4Xu2UOyxDURjHG5H0XvVo6bsepV4bg8FgsDNISBi8NgNhQCIMIgaDQcIiBptYzFi83++UtqGe0RAkTautieSv3xHLEfde8ZgM/5ycc7/v/O73nf85qnlVHv5KKn7hN/UPw0JsLpbic7Buz8Kq2YEVfTab0zof+5kUwWjDtVQH9kvTcNpuwHGTCRe9enjbjNjMz1QMlIUtCrnYLrTjvEcP/7QGoW0BD1MJCO0LCMzF4WogGTtFGYqAsjCq6LI/BRG3Gt5WI6sstCPgfjIBpx0GPHnVOGk2YVmb8yGXlySM/navJB2340m47EvBms2Bwwobbka1OKqyYsORiYtuPa6HdOws+XxekjBqobMsFcFVEWedBjwHYuCqsbJvBKO5p84C/6wGngazbCslYeQ2MkFwKQ6eegseN0R4Gs3wthjhLLcxCLU1fKBmhvkWjJLp8H3DOviirTrvMsBda8FLOIaN14Nv6zdjWhbH5/OShJHo4KlFYWfUCC0muCqtCCyI2Cqwwx1taeTwrSoyEp/LSxZGIuuTI4MrIkK7Au4mEqNXQIR/RsOuxG5xumwLSYpgtBFdXqqQLE9W943o4Kq2steEj/9MimDvoieKLE5gGmnOx0jpS7Dv6h/2I3oFcWExXPipIE4AAAAASUVORK5CYII=",
    kh: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABkElEQVR4Xu2UTUsCQRjHF6rPURevEQSZpwg7RFhEdIqiFvJQ5sGDGtELletmq1QHN3BDK1gJSj3EuiEYksZqSX0E+x4d/jkjeHAFdyE9RIff8LzMMz8GhmH6hm9qddADagxZ2jS6wb/sV6gx2sDo9xdjgRlKzJCu1gniMS3LM4O43edMCw3L7m0OfPQ34tTIFBRFwbN1luakTvqtM60YkhXqN7gIBHFnX6C5yzYJMRrFgX2O5lHbNGKhcMebGpIlWTfS6TQCvm0o5yIkSaIk4nGa+zddUFUVqXWPbta0zLe4BI7j4HG7oWkaMpkMcrkcZFmmuZNlaT+45tTNmpbxq04IgoCjnV3E+BCEkxAuRRFCkMcVf4o9rx+RcBgRdkM3a0qWt0ygeC2jUnqFKiXwlnygVMuVZkzqpE/2Fer7W88wLCscCignkqgUS1BEicaEqlZuxqRO+iTWjs90ZxiWvY/PU7LLLmStjmb+4vQ248exGTytbNH409Z4se2gMvKNtPlaukGP/0aytGl0gz8s+wEY3D8FlT/5jgAAAABJRU5ErkJggg==",
    ki: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADRUlEQVR4Xr1SWUhUYRi9Dz300EMPPfTYQw89tFg5aqGlKWIb+lBEEYkNFCWt0k60EWlqhkW2GCKaFoUhZRK2qZGVlYUtkmWLOvfO6MzVcZnGpdM9n9yBnMoJyoHDvfOf77vnO+f7FXXeNIwWlOEH/xMjirXGB6FlkwX2ZAv0Q+FwrA2GGjkNzpQ56DwTic7CaGhJFr++X2FEMUIzBO1WC9rTwtFXGYeOslh478ZBz4iAti7Er/53CEhMsGwmnDsNN6Ux6DHEum7GQi9aADUx2L/2NwhczET0dDi2h0FdNMOfGwF/JWZLnA1HUjBs20LRttEC25Igv5o/IWAxbWsotNMRcF+Nhn7diPLyAjhz5kFN/sc701bNQkfufLjLY9FxOwaeqoXG03gvi4F+YT40a2B7C0jMtWcOuo2L4TFu4veaRT503zEEjXPbsbloSRg5UhGzL42AfnAH7AlRfgXq8hDohSnoebDREFv4k5jnfhx6H+6H85QVtvhhYlFBcO1KhmvvZmgxQ86VzmdP8X1gAPzx6aquRFPqYXw6kSrvg729wvHXq72B/VUm1NoD0JtK4O3UfFx3w1vpaTywB46bpfA67D5u0OuFu+45lIr6z7CeK8ekzWexIrsU5S+b4Onrl6JGzYUt+Xcweet5hO0vQEH1a3R5vMKxJv3GE+kL3pePnIo6tLmHBtN7vuFYaQ2CdudJ766iB7j/5gsUZWUaIo8UCxl99DL4f+yaTEzccFrep6TkYt+VKiTmlMn5uKQshB+8hPHWkwJy63Nvy/mY1ekizr4J67JF5EjJIxmGZ4qqd/umMd1k3aqVST85OuSMbuiEk3Oo5LwKXwI8I89+9pCvbmhG/8Cg8OZ3+VSozIioPHXnRSmu/9om5NXHDeKaE9NFSuE91H0e2sW71nafW3JcBVfCvprGVuFMt0yMkSu0y0J+mHGwUSwbYHF8RonsikOYEfGcT8aTV1kvH+JuzD6CUZNjL++CrIV2idqPqthmJDdefJCFmheFHCNl3fXa9xIX4zY5uiRHZxzavCisMZPgT6EruuM0Zhxs4Ee4fPOiMI7Fx6+h+NFbNDvdMpBv8QYY1YV7ryRCOjJXQzARpia3cbTwA7WBjXc+u5ACAAAAAElFTkSuQmCC",
    km: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABmElEQVR4XmPI3GPw5cFHrv///zPQHDPYrLT7rbvY+f/ia7IYktTGYMuU57n9B+GobSb/H3/mxFBELYxiGQjT0pcYltHSl0DLolAs89mQ+T92e/l/tQWeQF/6A3258T+1ANwywyVB/zff2////Ktr/7vPzP2fsrsG7oDU3bX/n395ja6XZAC3bPv9Q/9//Pn532J5ONgit7XJKMEKcsza27vQ9ZMEwJYFbMoBc5Ze3wI2uPnEdGCclWDEI6W+BFsGMhwEao5OBBsI8pnn+jQMiyj1JYNpjxPcsq7Tc8CGgSwN31qEYQkMa013/V/rZPJ/H4M6SRhsGcgXIHD6xWWwYdn7mv6DghbdEhD2KrP7v0pEG8MgYjDYMpAhoPgCAZNlof+LDnaAswA1fIPVMlCemn159f9rb+/8bzoxDSUYKfENVstgGJT0Yb6ihm+QMYPatACsxZVmb+x/i+QZ/62jFlMNY1imMtv7v2FZDYZCamAUyzT6o6nuG2QMtkxljud/g4rK/9bRCzEUUBMzaHekfDFPnYIhQQsMAGr0gQa3ZPcSAAAAAElFTkSuQmCC",
    kn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACBUlEQVR4Xq2UP2gTURzHv0OggWYIJVOJcEKGDDcERFqKYJZOURDSQiGDikNExCUtCDo4CBHcjBjoZEtpKWkNYhEFMaKWaooOOW1pEfyHxsE9Q4av790R7L33EtJrDj7b3fdz3/fe7+HkAjhIrj8HvzTAmXMgoKC+HJTMKvjWAZcegLERg2hQsruvwN1t8MykQTAo2fQ66OyB94tgZNgQrqIG9MP4Iji/CTbegKfGwGg0ylgs5gbG43FdIrCOBZBdfAzu7YN3boLhIS8oFArRcRzWajXatq2Jrl4C/74+hOz0ErhSBz+8AFP2/yApKhQKbLfbbLVazGazvja1KvhHLHNdLrMaauLaU/Cr2JvZKzLc/9fhcJiWZbFUKjGfzzOdTrs/0GnzeQLcgkdP2eQyuPHR+7vEcb9EJZVKuRK1TUfUU3ZDDOe3HfDyeT24G6Y2PWWd4dwQexQf1QNNyPderoHN23qbrjI5nD8+gVNnvZBEIuGFdTnOkgszQvJMzNsJPVzFlXWG8+E9/1VTrVZZqVTcjVclss0TMW+/b4Hvh/RgE5DDuV/Xr5pMJsNms0n5FItFd/ODtPHJTFeNe6osi7lcjuVy2T1p8oYI0sYnU5fnIJFIhMlk8kht+pZJjtqmb5ls80vchQ1b/zAIRpk8kZV58Occ+C6kfxQUTSZn7PujwbU5yD9eoYnYkVLkdgAAAABJRU5ErkJggg==",
    kp: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABDklEQVR4XmOwC5vxn16YAV2Alpi+lrVP2/+fXpjhcUPDf3phhmMMDP+x4XMqKv9vRUf/v5ed/f+yjc3/4ywsGGpIxRiWneDg+P988uT//37//g8CP+7fB9Ofjh8HOwBdPSkYwzKQRTDw8/Hj/zdjYuB8kMUneXgwDCEWo1gGcjkyeDphwv+TIiJwX4LAw/JyDEOIxSiWgeLoz+fP/2+npPw/AuQj49MKCuCgfLt+PYYhxGIMy2Dg2ZQpcIvOGxiAHQECVLMMORgft7T8PyEg8P+ihcX/UzIycHGqBSMIwxLIvYICcAIBxdfjjg5wEFI1gYAwetKHAZokfRimSaZGL1JoielbEKNXA7TEw9cyAJUW3Rz6pQRyAAAAAElFTkSuQmCC",
    kr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAC60lEQVR4Xr2VX0jTURTH11AKk17UkDDwYYgPIUYKUlYGlqMt2my1Howc07AyBBUy7MHmcLokRhhJWOJLUW/BEAtBxMr5BySkGUiWBG2xaKw9+LDq2+9c+l1/v3tR20tfOA+/e8+9n3POvff8DPiPMogD3d3dyMzMFIfTktfrxeLiojish83MzMBgMCArKwt1dXXaqX9WQ0MDent7UVhYiFgsppvjMJogkNFoRHFxMTo7O2E2m7G2tqb131CpVApWqxU+nw8FBQUIhUIYHh5GMpnkPhxGEIJVVlbC7XajrKwMXV1d3JH0U1n4Y2oK0cFBxMfGkIrHdfODynhVVRULlNY7HA7YbDYWCInDKG3KpKamBhaLRSpjdGAAs9nZmFYCUi2UkYFP7e34/Xcz0tzcHDweD5xOJ+x2O4aGhvic7swmJibQ0tLCslOjIX1QzkELEe2dko0KVMvpcrkwpmSvlXQbFxYWENeUJx4MSpurNpmxHaM7c/B6mxFf+vv5GjonylCUBBMVrq6WIGSP9uyD2X4bh8/fh83qwVPTAXGppC1hr3J2S6CXO3bheO0dBlLtpK0PyY+r4nKdNoX9Uq794zyTBLt6qFEHUu3t6KS4hU6bwkiXLdcRzM7joAd790sQ1RLfE+JynbaE3bzYg6POe7h20I1LR67g2Nm7EoTMZb8lLpUkweghB5UbqOrb5yhO2fukzbVGwbx5vl5CuvLNzc38W5UOVl9fD7/fj9zcXPYEVE0/e4ETjoAEUUFPvA+578rKCkpKSljQ9N60z4jDKioqEAgEUFRUhJGREeTn5yMSiXDHr6sR+Bp9OFfbwyCnz/hx44IX70Pr3Z3829rakEgkUK08mXalu1DbUsVh4+PjLKP5+Xm0trYyx9LSUl0n2UrU7qjrU0+kxk6V0j5uXRmpj5lMJgaiTCmAdLS0tMRABCwvL0c4HNbNSxeko6ODRag9s3REGTU1NbEfqCgJRmVbXl4Wh9PSRv/APy+f6pzzQTjOAAAAAElFTkSuQmCC",
    kv: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABd0lEQVR4XmNQ8Vp6FYj/0wFfZQARWCRogQehZZbRa8G0Tdz6/9mth/5rBSwH0yA+sjwBjNsydd9lYEPsEzf8v3b33X/fnG3/i7qP/l+29RZYHkSD+CBxkDxIHUi9dsAKDLMIWtY88wzYQJCliTX7/usFrwSzQRjmGBAGiYPkQez5G66D9aGbRdAy55RNYNeii2fmN/3PKWzCEMenB4pxW4YLV1VU/7+wLOD/hqkJ/91jJ2PI48GkWRaf1fH/1OIgsGUgvHVG7H8d/4UY6nBgwpaBDDMNnvu/vb4EbDjMIhgG+RBdDw5M2DLfhIn/jy4MxbAEGa+dnPS/qKQeQy/JloHw4r50DAvQ8aTWfAx9aJg4yyzDZmEYjoxPLAz5bx4yB0MfGibOMhCOTOv+v2pSElaLiAhCECbeMhAGJXWQBYfnh/8vKakFWxKW2oOhDgcmzTI1n8X/986J/G8YOA9DjghMmmUgDMoCWr6LMcSJwKRbRgEexpYBAJNMjQP0BTidAAAAAElFTkSuQmCC",
    kw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA2ElEQVR4XmNgcBX9wrDd/D/DTUfaYwYJ9t8M7Ez/GcpV/jNcc8BUQE0MtoyB4T8YG/D9p6kvUSwDYVr6EsMyWvoSp2W08CWrCOdXDEvQMIeG0CedS/HH9B+kHqYEM8jIyOD2GRK+f//+f0rBqGWjluEFDGJsHASTvhGf0Ifn9oHHvjmHHaYEM0gzs+L0GTcj0/9ePpn/nyUMqIJxWmbLxvP/qqgWhgZKMIZl1PYNMkaxzJSV+/9ZEQ0MRdTCYMs4gL5p5ZX6/15CH0MBNTGDLzv/F1r6BhkDAIRcsAWrRMymAAAAAElFTkSuQmCC",
    ky: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADkUlEQVR4Xq2UfUxVZRjA7wYDQmts2PrYxajl8p+YVusLo7tCpFLBIUJBogJJsIsXqOASSy5eBnRvmCIINAQGIgLKuF7RYHhXUBe6GDNBQrRjX2DUoqmMUuQX51gnPq7MgD9+79me87zP732f875H0R22hdHeXkpLv8DNTYNC8ZaESmWkT6WSiIgoleNiTk3yPi4EBtJfa5bjd4CgCA/4eKxvSyQD6ekMDQ4TFFR4W1nY+lx6o2P5OS2NoZ9+JSSkeHrB2RAUE8ONJUsSpdWe9/fnmtXKsWNnCA4ukmUJCTUc1+7h4saNjHR1UVHRjjjHTsHZEBRGY9NNsYUiTeYuBsoqGBse5vr1MVk2InzP73V1XBm+RnPzOSlXxGD4dHrB2RAUXyuX0qlQzAlxrp2it2PhZI6OMax91YhBn8+LL+zinrvtyKqrbeMWSx8iNtslrl79kxGbjb8GBuU2jo+Pc3N0lKGmU3R2XJByRQ4d+koulp+Tg6k4nOYDa/j28528pNLNlE0MN1xc4qT+i9/mu9BQOpLS2bq1TJalpBzFar3IH2Yz/QEB7E8oQJzzbyGvZ8JZFbSGZc96oPR6gNTkDdx/33/XSJb5+u4e7u//haHCQs6Hvo42skBqib2jHxdXxZXLv/GDRkPP2zvw9cmW4s7OUbym2Yy7z6M4PX4v7k8/zBPe0TNllyztY+KRtmiNeHpq5Zf2ZCJKZbJ0NcQrcjbkTVxdI4hYl8jejBwyd+aRkbaXJHUym9ZF8dzKpKmylUr1wPKlU4ISYptWeMRLLF6snvFeXNhDynelp+UpV4qXu7BP5YztyUWcWHUXDY8souWdWzuXZbeGqYX+D6LsE09XDm52oDzMASHRCVu0Eyf9nBde5jGx81qdjpKJf6VJq6U+Kor6mBhMSUmUGA9OzhXmLRN3tv7DI6jTfNhmyCGyqIXYVG9id+/ivT1tk3OFecvCnk+htXeQ93UrMJ0qx3LmGzKyvKk9nkudvkw62f/kCnOWPegejzHTyLkP1lJZf5TVH50mMz+STTHLUJe3kVDZyYD+Fb5szMbrsdT5ybSBOoYOqDlRuprB7mxO91wmpciAfv8OajsG6bZW8dlhP35s3Ea7Vjrtc5e5u8Vjacjj5JESmqve4HBROA3mCgpq6jFVamipDqa1MY+zbSW87KOfn2wyjg7RhARsJy9rOz2tRiqLc/H3y5qeJyyI7A4R/gY0WQPRQlD/bgAAAABJRU5ErkJggg==",
    kz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAChklEQVR4Xr1WO2hTYRTO4Ojo6Ojg6Ojg4ODg4Ojg6OAoWKFI8IHGgNYQa0OtVkjbmKYPW5tWEawYaa1CqVKs+EJ6/0fuLSh06KCgIPKZ74RE73/TW4Xa4UvuzT3n/875zuMmccKDOa8CFMwosuolavf/CybBj1v6AfJmCkVdcg02E3WynJ5D0QxhwIy7BpuJOllaLYuMOf3MNYjgtFpFt54RJW7qaXSoN2j3vkXsWqBOltGvQMTV7JT6IgQTNidkDPCanke/ncA9m4n1DZExo0f2rGTXwkiIiqaEPlOuET3Fsr8f34PtWA12Ybbahsv6HfK6LAG7vhGyTr2AMXujFvmkayCgVGXTJTL/DLYBK4kQlL8PF42HIVOQwFz/EBkloP7rScFu7VXTMP7eCFEDlLhgR0Ve1z9ExjkjUasGOal+oEdX5Dmlc0kaeGgv1Lp5LE7KOhkPG7F59Ou7rgGS3lpz4Ff8PRGSBjijBAOnX0oZt0vjyWhMeVgzPiNcEuJzsBspbTFpO+WbPk9suwQaIVtPRv7+0T8gMrL4V9ULiX4t2NkkeusfQlp7mLJZ9JgK5uxxfA12YKF61D0vvkH4GyVcqh6WLuP1sB5ARi0h5VmcqQ34FfVaMkorDxWbFIUeV5OYrx7DOe9TlKzZ+jrc+iS7pD4ImB1lyepFlPRtDOpBybRLP0e3msGsbZM6ccOwtrT/86wmWdxQ8xk7jITj9rpcs5YEIx+2fSIt7xkcVeCosItbkm20rriWWDPWkOC6um86cMf0Ng9lUIvVI5KZ6x8i+5dFTJthk5dMeTD9SMwZixno32TyitF/94qhXMyGO5Gd+N4/KM1A6TbY/nWyLX15btXfgl/vYcMXBAIVYgAAAABJRU5ErkJggg==",
    la: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAtElEQVR4XmN4ySD0n16YAV2AlnjUMqpgBgbbS/9JwQZJt/67F98H0+hyBDGGAA4s4X/t/+nr3/4jAxAfJI6uFifGEMCCRXyu/b/+8AeKRTAAEgfJo+vBijEEsOD6eS/Q7UAB6d1PMPRgxRgCWPD+c1/QzUcBq/d/wNCDFWMIYMEgw/ABkGPQ9WDFGAJYMCiY8AFQMKPrwYoxBLBguiYQEKZb0kfGFGVq9CKFlnjUMqpguloGANz3rw2MRn6JAAAAAElFTkSuQmCC",
    lb: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABXklEQVR4XmP4z8Dwn16YAV2AlnjUMqpgIEkauP7q+v+AxQH/H394jC5FEJBk2e+/v/8bTDL4z1DJ8F+gUeD/hKMTwGLEApIsK9lW8l9vot5/hS6F/xJtEv9lOmT+n35yGl0ZTkCUZSDXgyzyWuD1X71P/b9Kj8p/m5k2YEtzNuX8//zzM7oWrIAoy0CGgQxX7lH+z1LNAvYRKChFWkT+a/Vr/W/Y00BUcBJl2YqLK/77LPT5r96rDrYEZhkIy3fK/8/YkPH/++/v6NowAEHLbr+5DU59IINBwQayCJQ4YJaCgtRimsX/OafnoGvFAAQt23Jjy3+dCTrgBOEy1wXuI45ajv81u2rADnGY7fB//9396FoxAEHLQMEDC6LD9w+D4wxkGU89D0rQvf/+Hs7GBQhaBgPnn53/37Kv5f+eO3v+r7m85n/Mypj/U45PISphwACdiyssgrTCo5ZRBQMAW3zQvcjWX8oAAAAASUVORK5CYII=",
    lc: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABoElEQVR4Xr2VPUvDUBSGL5hJHDJEcOgf0N/QWbo4iIMiSCcpSBZpEDcdCi5KxcWlQ9WlizRQqAXBRQdRqcZagm2lflA7KEqJ0KHDa+8tBZubjxtBA0+G+55znuGeELJ4jXoX/AN1Ql8OgSdLBn8mwO9kp+/8mQDBZZtVsGfd5DMfgssuPoB0Oo2TNz7zIZhsuQSY91VIkoSnRhNqsLsLJjtsAJqmgRCCRCKBg2e+xoNgskarDUVRmCwUCuHR6nA1HojLtmtAJpNhoj66rmOjwte6IC67+gTC4fCALBKJsIWx17ogJovfAcZtiQkUmSC7RTAy3BOWyiZbHHuPA2IyuhiqqkIaIjjeJUCxJ6QyujA0t/c4ICajiyHLMpJaT9RnLUbYOc3tPQ74y3YegFQqhejUoKjP7CRhOa2z9waWGS1gYWYc7XNeRLHOCOanJ1idvTeQbKW7GMWLAl6OeMlPaE7rVsv8DGFZ7rWDan6MG+5ELT+KQtPzI3eXxW6Ar0qUG+qFZc55/evcZarRwX4xh2Q2KczepY64YXGzfGV/QP0b/P5xvXCg244AAAAASUVORK5CYII=",
    li: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA80lEQVR4XmNg0K6/D8T/6YDvM4AJTAkwZtcrxRCjAOOxTKP8v4mdLTUtxLSMWyXov5Wzw39bJ8v/2rrK/01srP87ulr+F9YKRNdMKsa0zMbZ7v/FLTb/mwvk/0f4iv1PC5f8f3On5X93LzN0zaRiTMsc3Sz/N+TI/Y/0Fvtfl63wPwpIlyTJ/I+NNEHXTCrGtCw42v//iZUG/2/uMPm/b6He/wd7Tf+fWm3wPzneCl0zqRjTMhbduv+qhnb/RaWV//OLSP4XkpD/L6dh8p9LKxVdM6kY0zIaYjpbdk5Q7T4Q/6cDHrWMKnjUMqrgUcuogu8DAJGU5DEw5UOAAAAAAElFTkSuQmCC",
    lk: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB/klEQVR4XmP4v53hPhD/pwO+zwAiIsq1/yskWUJwvOX//+kMCNzK8P9kM8f/LVl8/2cbq5CMF7rK/D+cL4iwzCHP8D9DmCMc/49mQOA6hv9XOjj/rwyU+N+hK/+/V0GTJDzPUxJsIdGWPZrIhWEIKRjkw6FhWa6M3P8cCeKDlCLLNhdx/E+Tlvnfr6z2f3E87//tBTz/C214/68rYv9/qJHt/xxTJepZtqeG/f/SaIH/Xzcw/H++jOH/CyBeWsDyf24i1/9+H/7/zQEc/2f7C+OwLJs0y65NYP0/J1jw//5m5v+vVzL8vzuP4X9XKOf/ib78/yts+f9vyOb+X28mhsOyJOItK5OX/39pAsv/Njn1/4uSuf6/XM7w/91qhv+3ZjD/vz2V5f/DOcz/361k/N8XwEu5ZSWqMv/XFLP8r7Hj//9/GwN6KQHHh2o5cVhGQjCWSyv/n5fG/v/TGsb/b1ZCDP69meH/13WM/x/MZ/r/ewtEDBSn2C0jIYFUKyj+P9XJ+n9WsMD/Tm/e/9+AiWRhmBBYbmGEwP8nCxj//9jI8H95FESMIstAuFFVEUxPcBH9/2YFMHFYSYD5rRYSQN8x/r88keX/gmAqWQbD9QaS/5tMIBaBMIidpi30vwVoaZGiLHUtIxYPXsuoWsUQqjzPtlGx8vyPJVPSAN8HAL1LdUOfe1U+AAAAAElFTkSuQmCC",
    lr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABJElEQVR4XmOQkSn/zcCQ9h8fPmlg9v8MAwPFmAHdMg6ObAzLTjh5/7+koEAxxrCsv38PhoX799/8Tw0AtkxEpOi/g0PPf2fnvv+fP//4X16+FszX0KgDW3a4a+7/NwsWUIzhPouPn///9evPYBf8/v33/+TJ+/4LCBTQLs5AwXX//huwhQoKlfBgPFLR8f9ZQwPFGG4ZKCiLi1f/Z2HJ+G9h0fE/OHgGbeIMOTFgw8dC4v/fdHCgGBNlGdXi7MGDN49B8YQPf37w6P/P+/cpxgw/Hjx4jC5IK8xwUUbmN7p3aYUZ7gYEfEGPSFphBmCKvI+eRGkFGJ53dLxFz3y0wvSNszdLlrxELzBphekbZ+d5eP6eYWH5Tw/McIaZ+R962NIKAwDJk4Dt6DKBdQAAAABJRU5ErkJggg==",
    ls: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA00lEQVR4Xu3TIQqEQBiG4T97BsFNNsHogsk9gMKUTd5BrHoGQdgkuGyTzUavYPAEHsI44Vsc2DIg+iMW8YWPQWbgSZJ5/0q6vXH0lHNhe3dyDMAIRlJKJEmiTmYjG2vbFnEcq5MZHyvLEo7joCgK/WotPlbXNQzDQFVV+tVaPGyaJti2DSKCZVnqm9F2rO97RFGkoP+CIMAwDPrTpbZjaZoiDEO4rgvf9+F5HoQQyPNcf7rUdmyu6zpkWabgGWmahvMLjGR+npJeDxw95VzY3p0b+wFgX2lvQ5MM0wAAAABJRU5ErkJggg==",
    lt: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAaUlEQVR4XmN4vIbx1//NDP9pjUH2MIxaRike5pZNm8n8Zv5s5v+0xiB7GBiKOa4C8X864KujllEDD2fL8gyZX1dpMv+nNc4H2sOwVIDxx34Ghv+0xiB7Ri2jGNPfsuX8jF/RJWiBQfYAAGf1IW+1Hu+JAAAAAElFTkSuQmCC",
    lu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAZUlEQVR4XmN4q2l5H4j/0wHfZwARWCRogUctowqms2WfSxtefqls/k9rDLKH4e+Ll7//0wGA7BnGlj3++psuloHsGcaWRR9+9TL+yKv/tMYgexgYFt67D8T/6YDvj1pGDTyMLQMAUYMqrOnoV5IAAAAASUVORK5CYII=",
    lv: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAPUlEQVR4XmPYamP2e7Wy7H9aY5A9DKOWUYpHLaMKpr9l////v/+fPuD+qGXUAPfpm0BGLaMUj1pGFUx3ywDiku9tbNpbHwAAAABJRU5ErkJggg==",
    ly: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAjElEQVR4Xu3SsQkEIRQEUAMDQ+EMzK8FOxCuAUNLMjS/ZizGMmbXDW9wuUB/tMITGT8MiKqrF6So32Cnp2wJda6xSaFgJwpuee+Rc4Zzju7+QMFUSgm1VlhrYYy5shACzd2gYKq1dhWNs9YaMUb03lFKodkJCqZEy0SfcRD7IAtQsM/7+4GUp2wJ0bIDmhpCN+tZI30AAAAASUVORK5CYII=",
    ma: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAi0lEQVR4XmM4qK57H4j/0wHfZwARWCRogUctowoetQwVd5vrYYgRgcmzTCLaGEOMCEyaZXGuBv89fQz/q4QbgmkQH10NHkyaZTu0dP87+Bv+r7fWB9MgProaPJg0y0AY5BtQMJLoKxAm3bJEoCXrdfTANLocAUy6Zfs0UGkSMOmWUYBHLaMKHsaWAQCIhFjrNJxoQAAAAABJRU5ErkJggg==",
    mc: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAO0lEQVR4XmP4ImFw/7OEwX9aY5A9DKOWUYpHLaMKHrWMKhhs2f///+//pw8YtYwqYNQyqoBRy6gC7gMATQiIY9zjQFAAAAAASUVORK5CYII=",
    md: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACUklEQVR4Xu3UT0iTcRzH8d8wMxuLp3Vxaegq1y5Kz4JJ9MdYUFmkkbkMskTMJY01NnCRfzYvTSUpc7TIQUsGaxI6EcxqNcPBjMCFYVGzjRbRrW5dgj49e4KFP8cei52iw/vw8MDndXi+PISwrjgXMoUYESwmZ4SKk/9YsvgsV4gbfiZaAr2ayiIWGlLi+7scTPsI/MY8+O2VmBsT89C31yKM9m7FQIGYHqcTxtRVHfC278Kb8ULEwwTz47noa2ER8kh5LOhm+Pee3ZvocTphrFZ7gR8LDhXj60uCLy/E0B0pReCOhMecXdJfWLWCHqdbORYxyRDbLsWUQoL5Q2KMbVuHaDmDQN36LGE7nCnsg5lBnOUOgiGIBLlD2cylIVg8nZ/CppUSGlghtqcHpL4ax06eT2GRDdw3qiUIHyWYqePQkt/Y9ZoiTOzNeCQZsGT7zGB1lfyYr68GPW2X4burBkDwYELOPzvaT/HvB88UYHHLMuAPME03KuoPwmYrg/uqARf1rTC0WnCuWQF79xXoGudgNZl5zNVQRI/TCWCq26hoOoAuSxkWJmVo0zehudGIW04ZOixGDNhO8Ffpsarg1srpcToBjOtww1loOzci0Z+L54Z8PBlWwm7WY+RaOYItUnweEaHfXJyFa+SqOm7Co848zKoIEsE1eOgoxQ09C6+VRfS+BB/3c9+vNwcuTQk9TieMrVXfBKIETy8RvA2sgn+QwbBlJyYdhUjMrMYnI8HCPYLHy8fphLFk9B8+7GXw4/3Sn3Gacbq/w9KVZpzuH8Z+AkH2fIwxNV+NAAAAAElFTkSuQmCC",
    me: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB70lEQVR4XtWV3ytkYRjHlVas7MxOXAzmwmKZH41mzOyQCyskbVJyo70gaVtKDZrkd5tkSY0UsbXutnDhUtEqdd7zA2WJe3/Kd5/nVbs6p5Fzatr24nuenh/f99M57/t2cu4Om+5vD5uQbTEnhx+q9xVEbn7WxOv/HzCl1GWpPSXHMK3Th9PPIajt5ZZeJj0bprqLoIZL/uTKmB/6dBBi3P93hvo8Z/bah7X5oKcCUIpd0AmkfqyE1lsho56sfahTn+fMXtswfbQGF5sxiOYyCFrw124cIliCq+9xmXOd+zxn9tqHzYRwuRXHzX4jRIUHp0sJHC81yMg517nPc2avbZgxHcL5RhQ3e434ORzG6NggNua70TU8IXOuc9+YClq89mB5BVCTfpyvR3GxHYPxLYHZVB8OvrRgZ+6DzLnOfdFcavXbgvFguw/qQDW01QhE+h3Wpt5jMdWB1clWKJRzXe2vgsh/afHah9GxVrwuKGV06ubCOFmPIb3cIKO+EKa6G0dDdTiqyXzvng2Tw5/eQhuphZaiOzYexPWPBMUA5Sw/ztIE76m0+BzBFALJPSl3w1iJ0KejA/E1InPhocv8xmPxOIbxQVGKCuW+aMkAjHS9jE/tk3PYY70ooDd5/RDNvQxyDnOgfwcz/8KzIeb8BrpwWX4zE+2OAAAAAElFTkSuQmCC",
    mf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    mg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAQ0lEQVR4XmP4/////f+EgLEkNfB9hv+jllGORy3D0EgOHrUMQyM5mDjLGM5oUAOPWoahkRw8ahmGRnLwqGUYGsnB9wHM0MNgN0tZqAAAAABJRU5ErkJggg==",
    mh: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACvklEQVR4XrWUaU9TURCG+V8kLvGDhkQTEw0KFNCiBGhARIiNCyJIcIGAIkQUKaWCVLBABVSESCmylKVQlaXorWwBIhJAVJD42hm4l/aWNiXiJG9OenrOPDN3Zk5AYIhOCAwpw//UEeVDPM1LXA7wBQtOrPHY26lUSdn4UKFA/5OI3x6wPQodr4djq6BKf82r676/2hdWige31Bh/HszygO2PKGenMWmvcPWuCQUVfbzS74NRlfy/3Ol2Oh5dCNPjsxKI1GO8syrBCELKKGxnSEvXF7T3TfJa2TiES7mtUjBy565SqzMxqg+VIGN18RgeGsbc/Ip7ZsrLDSjS92NiZgmira//gWNqkQOIv9HkFXYgvISaYCsbQwj622rx89ca+5l1hQVF6zn6pncCA+RG++ezmvmcHKSIy0dvWaQE+tiQgYnJObf7Euyoqpqb4Z6uBybLuNsh0Wif/r+Y/RbHEgxS/bLSrkGoOskQoVaJwd5u+VUO3thiX/TIjGq0ndG+a2ZBpx/BWKCSsrE2a7CwuOJ2hyD1rWObI6QT3GoWqX7B0VONXC9QDamWVDM6F5uYA1t5OENGjMmw24UtgtNW19a5qcSx2ZAMRp+GWp0cv2z7jE7rFEemMQxudqMWBVkbs+MwhKPX3MSOfUO8wEjinJHz7JJuJN9ugSLFiNAEDUyaOAYNNOZgeuabBFleWUVx1YAXiA+YKBpiAlGNLqTc5Nmx18Rg0GrzgNBZ+X1P+YCRTpzToywnibOxNOvx3emcbH7hB39q/yB+wEJj89FZqoSt7go+OaYlSK7W4vez5S4vsPTU6xitjoKlw8zd+G8QUTLYoVPFqL0fj676Qsx+XeKWp7fS2xO1M7nAziTkwlyhhu396C5DRDlhe8O0jrzMVJjfGGEbmeE5212IKCfsmbZoydQxxG+e54HdlE74C6dThSVfq1+9AAAAAElFTkSuQmCC",
    mk: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABpklEQVR4Xr2WvUoDQRSFL2onWFjoO4hgIYqClVj7FHYWFj6BYGGeQLCwEkG0sPMBrAQRMRpBo4sWSUCDPwliDDjul+u4k9ldXEG2OLnMPXfO2bk7MxsJZqXaPhVjKornDTHFPjFnEsfFQFQHGPs1gPno2Dr08ZGQDEpDYho7EVlfiwtYtI60huhzFsy3Wuiij0/HzD5NbVnM570WPazERcDLpvJEnwPMg0cHPadLkZnF7YwuO82wtqQc0eesEfPR8fi4GXDb6hsGc5onJhk5bfORbAbctlYXo3xpUEWJNgef0DYf6WYWtq2VBR0Xe8WUJzQyJp/SNh+/mwHa8rot5no0jFvRKq5GNJ/SNh+BvB9K6+1AzNO6CtzNh6JjYs77u4sRrheiLd05IgXNu3XMYz466KGLPj7ycSxtV8AF7Wnu6bkpT4YrCrp5xuThqXMvBx/4ZDa7mY7zoDz+B7OsbbwcDsXOuwWa+5rP3EZenFucBDbA46q+n8bu95Oe6Jh85g3CTwLxg9jW7wlbOqWR8b9s/dwOdW7XVS4XcW6fmNw+nnn+LfgCSD6UGAftMw4AAAAASUVORK5CYII=",
    ml: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAQklEQVR4Xu3NoQ0AMAwDQe8/QpfLKGmxLSVGRQZH/4GDenrSbcCqkNlK4ywzg8ZZZgaNs8wMGmeZGTTOMjNonP2dXfX6m01cDtV0AAAAAElFTkSuQmCC",
    mm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABTUlEQVR4Xu2PP0vDQBiH72PoN+goRCgddHFy6OIiOnRykX4PsS7iYAeHfoJCaQSnggkdHHSqim5ngxBa1FKaQQrJa3+HKdxdmlyKLuILDy/3/ns4Ft0xHt0y+nVmHvYvk7gv6LUslpVRcKPVMllK9rhGCGStlwZkDWelfXG92jXl4bXhQYas9tKAh1m2xddti0zxAuESWe2lAc9CWblTpuZLky49e47rO0IUh+u7Uh/z2FNvZcrAvrNHfMIlwaLAHObVG8YysHm1Qa1+Szo8DafSG33Mqbu5ZTEnvZokiKPWO9Zmk8glqz+dqx4RqKuzSQhZ/bDYPqsWu1l8DPoBjkdhGA295zEy3qirs0nAw4aFEp9Babxv7YhfhP6ARpWqqCHjjUBf3UmAG8kmR6f02XHprbQt1fFGHX11JwEz2Wj3QKvl6X9jJvsh/rDsC99aZvunjfC9AAAAAElFTkSuQmCC",
    mn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABD0lEQVR4XmM4oq5/H4j/48OMgdMJYnQ9WPB9BhCBRQIFoxuMDaPrwYJHkmUXA1X+H9XUo49lL2YI/D9tp0F7y47q6f6/GqP4/5iuLu0tuxym9P/neab/twulaW/Z7QKZ//frJP7fr5aknWUnzbT/30iV+3/KRvP/gxqJ/5f8Vf5fClP+f85djfqWgVIgKPhAFjzpFf5/M0Pu/5ulvP/vQX2IbjA2jMVwdIxqGcgn15Lk/5911vj/ejEfbS27DgzKt6t5gJaI/3/cJUJby07baf5/3C76/0q40v8XswVoaxkokdzOk/5/p0Sa9nF21kUdXIJciVaknWVYJFAwusHYMLoeLHjUMkzD0TG6Hiz4PgCk+ljoyNrLwQAAAABJRU5ErkJggg==",
    mo: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABbklEQVR4XmNgqIi7D8T/6YDvM4AJTAla4FHLEFi+OfT/kk16YBpdjgAm3rLCBXb/tduD/nNUx/zPnW8PpkF8kDi6WhyYOMtYKmP/i9RHQthVif9NpzSAaRAfJA6SR9eDBRO2TL0tCOwTEJujJvn/9BN7/9949QxMg/ggcZA8SB26XjRM2DKQq2EuN5hY8//+u9f/b795AaZBfHQ1eDBhy0DYYlrj//hVs/47zGr7//rLp//33r4C0yA+SBwkj64HCyZsmc2Mlv+///4BY5BvkH0GwjA5kDp0vSRbJtNe8H/15VNgA2Fg3ZUzcDZIHCQPUoeul2TLQBgUXMFLJv1ffuH4//VXz/zP2rAQTIP4IHGQPLoeLJiwZSLN2f+Lty7/X797HRj7L5oADjIQDRMDyYPUoesl2TIQBhmUvXHR//lnDoFx2/5NcDZInAiLQJg4y2BYobPof/SK6eBgBNEgProaPJg0yyjEo5ZRBd8HAB5sM2fKPTNVAAAAAElFTkSuQmCC",
    mp: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADP0lEQVR4Xr2UX0xbVRzHG12c2YMSExONWZao8cHogzHR6NsSE5+MWbYF3AhQGsqfsUE7OqCz2GaUQG9bS+loBy2z7HILBWmhW0Ohg24sqIQ0c8uiJuqLDz74ZybEF41+bO8icnd2N3zQm3xyk+85v+/3nnvO7xgMljz/G4LwAB4/KrOnaUHQd4Qg3IOXTo1R7Roi3Wfmqvt9HO8c5KK1lXzEhRQfpqJhDMPxrFAnIAjb2GVZpN51mY+tRr6WjGwWfKzmImTzC1idx7i9JLHuMbFcGus6p2BozQgeOwp71LZMRLrGZGMjG+fNTM3KtISTvNjg55kqJ88ZPVQ6wyRTsdKK60l1HcQoRQWfHYUNxMcJNh6gmDiNLTiqai9YLuD1eDkbOovH46OiNqTq9f2l1fqMJN0Oqt2Lgtd9w56yTPNZ5jx9R16lNTi5pT95IkkgECQzn6HJ4dXsU3VviLaa/UxP3fkrd3vqhtk/nOHL4fcIjTgxGMc1Yx/4wpSf2i6Ptq4th9lax4zdw4GBnOCpG3bGvUah421sUxs8XBvlUM8oneEZukMTrKysqGGZbE7Vyhz2zat1DuUi8c63kMZ1WkMQSrgH18h7Bzki3VnVnuYE/bOfqiHbn9//+JNT8iq7Tl5W59lGPmKsy0pyeknw1A1rl2SGvBEO9f2zX+Vj3ROd04RVDmkPQ93oFQIxH7aOOcFTN+z1pnqCk72EL61r9NjcMpubmxSLRfVtj2kbuT+eweSowjm8Knjqhj1tSXBiwMhPP3zLs+2Kqu02K9y49QXKhILf6yedSrP4SRGDSVbHX+mZR4n6yRRmefOkTnMLQpmWNNaAwq8/F5Gzq+yui7KvY4bG3nNqn/1NjZTksWOT6nW1vHGLBWUQ14V/2WdlypsuZwv8dnuNxNWbvHwmT1VLtybsDXMfz7fHWf/qO6YDVuSFa1uH5Z4IwjYq7AWiqVm+/3yMX378huY2myassrmTtUK6dHMYGYwlqDBFBY8dh5Upf6lducL1nB97t10T1tDaxKWJXt4dSKlNfXetgCDo8IQpQo3NvRV02uHitaMdGA77hLm6CMJ9eMiyxN62BHuPyzxSMyKMPxBB+A/5C82j/tWeF8aQAAAAAElFTkSuQmCC",
    mq: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    mr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABMElEQVR4XmNgSDK+D8T/6YDvM4AJTAlaYMKWMSYZYYhhw0SoI2wZNmxaroEhRgTGb5lghj6GGAif28iFIYZPPRTjt0y7WBuFn94p///tXpb//48wAGlmIF8Or3o0jN8ynwYVDLHVSwT//zrMCKbR5bCpR8L4LWubJoEhVjtZ6j9HiiGYRpfDph4J47ds3VLB/zxphhji2DBIHUg9ujgSxm9Z/0yx/1Nmi2KIY8MgdSD16OJIGL9lGkXa/78fZPpf0ifznyXZCEMehEHiIHmQOpB6dHkkjN8yEC4GGgRKfcfXc/8PaFD+L5OrCxYH0SA+SBwkD1KHrhcNE7YM5HKQQSCXgwwFYXQ2SB6Xz0myDIZBQQSKk8Nref4/380KpkF8AkGHjIm3jAp41DKq4GFsGQDrb3eXCxJISgAAAABJRU5ErkJggg==",
    ms: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADF0lEQVR4XrWUfyyUcRzHv2suFmvEuJVi0UbNxvRHNZcrFvIjhlyYH+nqVAqPkbnF/Ch2Us1lVuaOMq2TKf7oWPRH/NGKmUSsnkqpkevHIpvyzvdpjjtk2vnj9Tx7Pt/v3q/v9/N8n4f0iqJ//+zrQ23tE1hZpYKQ4xz29plg4+LwlBAoFO3aOiUqqAT90bH4IJXCe2+hztg/YEm6+MbYgOgIPhUXY+TjF4SGli8ps7XNQPN5OQYDAjDe1YXGxm6dBS4DS+iFhrRkXuJCJnp6oFI9g5tbvo5MIirFQEwchnNyoBn9hthYhX7YcrAkI+PuWHb2fVDuVbXhfWERpkZHMTk5pZV9HfuOEbmc201v7zCKih5w8ym0A4sELwZLngeGTL8UCrEY3Xw+J9Ovzydy5wra2GW7eZoG/i8Jron6oUvBksFy5a/PSiUWo9/DgwvUr88ncE+2fuhSsMTOLnOI9t3LqwSdnW/xva0Nr0UiqBVq7Tvr6HgFjWYcmro6DEbHID/tJveuKCYmp/RDl4IlPF7iG4ZRYXxUg3fJyXhx4jQO+ZUsOPrm5sncnX6T9NQ+PleoPRwSVQtcZde1bDuZrvMceEcNR0fpEGlt7Z/42tSEAV9fKBk5zMySuAB92ewK/f1LMTSk4U7nYPhh7HZOR5i6C6T6IYj0KojAB+s2boGV63aQ+FSubl/f/ldWnVT8oyk8ccGfgH6sDfGZaPE4iISEKp0xukuZTI0aWR0EDmfmZDMYl9XDyTcAwfFeML5Qpivjermwvytivsy6ogHWAiFc4jxAsopWV0Zx8vREZII/SOnt1ZU5pDIzMgHIgc0geTLDy0JUj7hQl8t58MmVgO/uCOK1CYRhuPrWW82wsWHeGUR2lknDFT87yKMskCe0xLF9PPDcLBG+az1qBCbIjxbQeaxBZEERBajcb8EFV4bxUCHmYY27FXbvMOVqTGoanccaREZJnglUCv/upCBgLSL3bEBZsDOyxMHg8w0sMzISIyIyC7lJEbjma4uLR71xOkUKU1PJ7BzWYLI5ouDsnAJj41j9MfYP9AnuU8JiADEAAAAASUVORK5CYII=",
    mt: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA50lEQVR4Xu3SvwsBYRwG8PtnDRR/gSyYSBe95/3BdboruSRGEgNZFIvF5IoyGih1pUf3DtI7kLyx3FPP8n2GT3e9BoAdPszJ96crw8CH3Rn4Nxb0yxCkAFbNITys1Fkvtu1k4TgOOOcIg5k668WWbg6WZYExhuOiq87fY5teHkORwKiZRKVSkphpmnAdKu9R92OqB/NrGfnrokaQ53nyywghj/uMp/RgQysBUS+gQYuglMK2bYlxzuQ96rqV1oM9Z+CWJSiEwKRD1Fkv9tPX+FMsPAa4zNuyt+tZnfVi7xJjMfYyMaZid7By2t6CzDvrAAAAAElFTkSuQmCC",
    mu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAVklEQVR4Xu3UoREAQQhD0fRfwjb3S+FAH5KgEC/MbETcKiRSLEAVTeFwYyNQXv7vFtzYBHbH8pBiAapoCgdU0RQOqKIpHFBFUzggvYyXv5bfjY3YHfsAr0WAOyCLXf0AAAAASUVORK5CYII=",
    mv: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAhUlEQVR4XmO4JGB8/5KAyX/aY+P7DKOWUY4Hg2VSBVb/GerIxyD96GaSbZlAm9t/14X5/1UnhmPIUdWy+HXN/w8+uPBfoS8YLsZcb0N9y3SmxPz//PMbikXYMFUsq94z8//hhxcxxNHx0LOMrsEIwnRLIDBMt6RPDCbJMtrgUcuogulsGQBNGzUpNuezeQAAAABJRU5ErkJggg==",
    mw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABQUlEQVR4Xu2RP0sDQRTE998lt4mg4ImFIFgoImIhKMSYRgQLS4sURgsFBQshhYUBCysbO7+NX8YPYGHAdCmeM3cpwnHxDsI1IcWw8Jid385btWb0UCkleaprJfBKu2qlFRg5q1jZslpchjdLMacI7AKAbs3JM/RaD+QytPLonbwvBPGc4PSdtHJhbPOEsDsEsxGbsN2qSc49Z2IwH0EP/emMQrAQFx980oaQRa1lB+GcsRHD1zGn7yBI5jehm7jWf2GnWA1b7QPAgBes72fFy++YviMfr5ONGgByxfSns3JhH3j9NVZUQ1AzsPK5VJ2oXWskwlqv4L/12f8Xc+697XdgGtd5xcgRXnoyOovoGGqN/LyfziRHDZbDr0EUSukCZw6bXrMN67U3+93OtpQtclSjdzjceGtK2SJnDptasw37AyeEldfruBfcAAAAAElFTkSuQmCC",
    mx: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA8ElEQVR4XmNgyHC/D8T/8WFiwDlBNUL4PsOoZYQAFsPR8ahlhAEWw9ExaZbdv3fm/8Ud8/8vKAv6Xxdu+//5vRu0s+zy2fX/r2xv/j+nOOJ/uafW/644F9pY9uLl3f93r+39v6gv8H9Hmvv/SaUp/3vyY/+/e/ec+pbdvXvs/4ztW//P7XL+31MV/L8uPeD/3u1r/9+4cZD6lr15ffv/+r0r/qd0dP6Prsn8H9XT8X/V3rX/Xz67RH3LQODmxRX/V/UX/F9Qlft/8bSm/48fHIPLYTEcHZNmGT6AxXB0PGoZYYDFcHQ8ahlhgMVwdHwfAGVROX5QISG6AAAAAElFTkSuQmCC",
    my: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABv0lEQVR4XmMQZ4j6zciQ9p8cbMLg8/8MAyOx+D6DrGD2X3RDiMU2GiX/38yfTxR+NWXKBwZ5icJ/yAYk+Dj83z9T6n9zptF/VdmI/6zMKWBxTrZkDMvsLVr+/7x/nyj89eTJ7wzIwViTZPr/8Tbu/4pSkWA+yCJRgbj/jsY+/0OcXP8bqgXDLQdhkoNRTjQP7DNB3oT/v08y/Y/xdIIbBjIY5oDPh1j/d+fr/ZcUjoHL2xnU/P+0fz9R+P369V/gltka+P0HWv9fViwabpipVuD/3dOkweIgfHml0H8XM2+470i2DBaMoPgBGQiyAGYZKNg298uBfQySO71IFBykZAcjcgI5PEfi/+pOJbhhoKC11A34P7lM+//sGo3/HpZeKMFIcgJBTvqgIDw+X+z//Hq1/7rKIeAUKMgbD5YDJRperkS4RSBMctJHz9Sg+AAFJSgLgIIRWQ4dkx6MMqUo+YwU7OjQ859Y8PPx498Mk2wSPvTYJP0nBy90Tfx/Pz6BKHwvOuYlwyV5xceXFBT/0xwD7WEAeQ/dy7QA4GC8YWf/7KaD439aY5A99LWMrsFI1wQCSpLoyZQWGJz06RmMAHMGL3g3N0QhAAAAAElFTkSuQmCC",
    mz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABaUlEQVR4Xr3UQShDcRwH8F9Ebja0TDm6WWmsiOwoLrRwmVg5KDnphXJUXKQlTd5ByYVWHLVirXbbTdxXprTctrQ0+fr9zbPt/f8Hen8On/q////33rff//3fo9NBKnTuEsj8Bzk3lRlG1hSLuokwEKHcQFgPKQp0ssIsl30EV1RRqIM9TMi2EwY2FcVOqcKEUhNhaU5xgxOvbe4XexAaq+PnoUA+mbxIJzKJlFOUI0VnAdZdGT+yO9bLyKnasBKbZuYEYd9POPqaF4pswX7zb32H8dadjxGiES/CUz6sRvpxu90FzNR3fcha7A/5qdrOshw4PuyDYRiIx+OILU/Wby9pDNtjO6EenG2N4ul6FslF/+c7E2t6t9Eyz5qZi4Urc9oOyHtHq3z0a7wFffni/UG6+HCccorgURx9QXS3wTL6qMO87EQudkoOC7IbuVCHapj4Ra3IBTpVwjx8YcqLuvFXTAVcyQt/4QO53jac7fU4GgAAAABJRU5ErkJggg==",
    na: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACO0lEQVR4Xq2UwUuTYRzH38OCEevm0YMH/4AdIpRGGoFEvLRDK7wEIiOGjArcofBQUAdhEgmzFjV1613O5qG1MYjEkRSl4dLUmrbNSe+ro3cxlqeI+NYzWGzv73mnLg+fy/s87/fzfnmf3yMc6w3gILl27xUKOQXr3d14Kwg1CNrN1bTbx8gzPcT+KbxekqFKEt43NRFRXZlr6CrGQmfxQDoHx63rZL0atzSHUmYDKVEkgl1lLHx0woqZ6aOIRDvw7HknrP13yL4LAxEsZ1TkPR7Mm0wkXAtXdj9ggxQ+A2wLZbx/27GmlfV2+2M8jCyhtLyCFYuFhPJYaG7+xZWxZiP+8/j59RCKmSPwT4joco6U13pvx5HOqVAGBzFnNJJQHhtOJzaVRZkrO9Xnhe+JFb6gFf6nIm4MO3D6yihCLz/jx0ISH81mEsgj2dKCUiKBcMqDDunwb66MwU4i+0+WSz64huNQZBU5lwvvDAYSyoO1kfOr6HvRiTa/UEZXxui6PInYm3T56z60tpJAHtVtTgZN/0R1ZQPeWRTkPLIOBwnUg9emrqwynMVYjJ0gEsiD7SvOTCP06S5poytjw7mjbGPNZiOBeqR7epDdnIc93kbCtZRlleH8Nj6ue9VoYW2+RyMIrg7hhGQkwTwEz1SyuPMlvetVU81+2tTIttzuwl6uGkYjbWpk2kA9Gm2zL9n/ttmzjLVJZWdxMWomLzYCV8ZOpBqexKPFmzgeMJCXGoXI2IytrScOrE01fwDGk3WkaX4cCAAAAABJRU5ErkJggg==",
    nc: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    ne: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAv0lEQVR4XmN4mKb470EQ239aY5A9DKOWUYqHuWWP5uT8fTM55T+tMcgehiffXvz+TyT49/3z/0/bpv9/Uevy/+3MnP9/P75GV4ITgOwh3rI/v/8/KzZFCZqXbQHoqnACkiz7ce0IRjyA8O+XD9CVYgUkWQYyFN0iEAY5ghhAkmUgAAo2ZItAwQoKXmIAyZaBEgQoYYASCCihgBIMsQBsWcrZspfpZ6v+0xqD7GHg3aB9H4j/0wHfH7WMGngYWwYAqdSKueuw/pIAAAAASUVORK5CYII=",
    nf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABgklEQVR4XmOQbGK4D8T/ceEdNzec/08EAKlD14uG7zOMWoYMXrx+gS5EG8vu37//v25xKbIQGNDEsvNXzv43j9H/f+DMHmRh6lt27NTR/4k94f+1EuT+ly3IQbaL+pbNXzv7v3qc9H+tOLn/rlWW/6/fu0oby27fvv2/c2XTf6UI0f/intz/TQs1/sdODPz/+/dv6lt299Gd/6ET3P/LZfP9V0uU+K9ZI/pftZH//8odS6lvGSgV5sxO+G9XavBfIV3gv1qx8H+nUtP/l65dpL5l6zat+Z/ZkfhfrpgLjI2z1P6bFqv971vQ9f/x48fUtWz19hX/LXK1/wuFMv8XDWf7r5Qo/N+4ROV/w8zK/zfv3KCeZcfOH/5vUa/xXx4YXyBf6RXI/ZcsZv6vWyb7P7LZ///+U3uoZ9nnz5//7zyx9X/Hhrr/kb0+/9VLRf437S75v/ncmv9LNiwEp1SqWQZOAUjAudnk//fv31HEaGZZ9HTf/xdunUMRo5ll2MDItgwAXCzRpaOAcBgAAAAASUVORK5CYII=",
    ng: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAUUlEQVR4Xu3NsQ2AQBADwSuEOqiCJj+nQ4JHn45OQETklTa0t45zu/ZR88kvuNHVqcTecKOJ+dviRhPzt8WNJuZvixtNzN8WN5qYvy1u9PfYDeiPa1RsAMRfAAAAAElFTkSuQmCC",
    ni: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAxklEQVR4XmNgSD92H4j/0wHfZwATmBK0wKOWUQXT2bLoebdexi+4/Z/WGGQPw+N3P3//JxL8+fkejL+8PfP/17fnYDaxAGQP0Zb9+/f7/+8fr///+f35/7MH18E02HIgTQwgybKfXx+D6an7TP4vXhjz/9pHiK9APiQGkGQZCIB8seGsy/+NZ73/LzgUSLSvQIB0y9DiCJ2PD5BsGSjOvn+6DaZ/fLkPpokFYMvomvTBmQ0zA9IC07kEAROYErTAo5ZRBd8HAFYEz1Q683DqAAAAAElFTkSuQmCC",
    nl: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAaElEQVR4XmPYbmL/a52Mxn9aY5A9DKOWUYqHuWXnKxvfnCms/E9rDLKH4f///1f/0wdcHbWMGmA4W1Y/de/rws6t/2mN66fsec3gmDD7h6Jb939aY5A9o5ZRjOlvmV3crK/oErTAIHsALNiP0cvkEpwAAAAASUVORK5CYII=",
    no: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAm0lEQVR4XmN4r617H4j/Y8Nfq6r/33/y5j+DRgYYL1h//P/P9Rsw1BGJ7zOACCwSYDxqGZF41DIqWfatr//t96nT/mPDv/bsxbDsz/XrGOqIwSB7GI7sPf1n/8mb/3Hh5VtPwy2r6F2PIU8sBtnDIG9f/g9mGC0x2B66WkbXYKRrAgElSSzJFIypnvRBBBYJMB61jEg8ahl1LAMAwLQh5Muq1c0AAAAASUVORK5CYII=",
    np: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABz0lEQVR4XmNIc6n5enjj8f90APcZMrXiftaw6//Pcq78//r1Z3QF1AT3GXK1Y3+eY2D4v4+B43+ypP//yQ0r/v/+/RddITUAwjIYXsQs+T/OJP//0YPX0RVTCjAtA+HTDEz/GyQc/udHT6Rm0GK3DIZBQZtumP5/Wt82agQtxLLLMjL/LwoI/H+3fPn/L8eP/7/l4PD/kogI3NKlYjr/kzya/x8/fhfdAFIAxLKrKipgi2Dg8+HD/5+Wl2MEbYtR1P+izPnkBi0iGB/n5///8/49GD+rrwf7FD1YQfggv/j/bPfa/zNmHCA1aDHj7CwP3/9Qdqf/UXzu/7MEHHFiX8Wk/0XZC/+/f/8V3VBcANMyEN4vJv/f17n9//PnH9A1UAJQLTvPwgIOPhBNAwsRloFS4Nv58/9/3r8fHGeg1EhlCyGWXdPQACd5GPj3+/f/R+np1A5SiGU3LSz+/379GkXm1eTJ4OCkooUQy64oKPz/dv48XBTks4fJydRONIg4u+Pu/v/D+vX/v54+/f9Fe/t/UKlC5VSKmRpBCQMWfNgwyEI/ty5yLMSezwjhQyq6//08eki18D5Dvl3ht1yFwP+k4gSd1P8ZaQtJKbLuAwAINe6Zsl1imQAAAABJRU5ErkJggg==",
    nr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA4klEQVR4XmNgUCz4TzeMIUBLjCFAS4whQEuMIUBLjCFAS4whQEuMIUBLjCFAS3x/geR/emGclj1YrIAhRinGGowaLm3//dPm/BfQr/xv4teLIU82RuawqBT9twjq/989a9//81ef/L9889n/6ILF/3XcOzE1koPRBUCW/f7z9z8MXL/z8r+IUTWmRnIwMgdkaHnnZhTLbj94/T88dyGmRnIwukB+07r/2w9cB1v4/cfv/9OXHP1vEzoJUyM5GEMAiJPLV/zPrlvz3z1+Bhijy5ONMQSgmGrxhIwxBGiJMQRoiAF10q7XMeyZGwAAAABJRU5ErkJggg==",
    nu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAC6ElEQVR4Xu2UX0jTURTHr+GDNULrJaFBksON0BolYg/FMggFIQkiw6BFoJKGQkJSPkgmvlTOB8nUcLSJGv1ZhA/JdLlVJlRLJ8n6FRMlTZkbNnXqsm87l6bbfpv0ED1EP/jy41y+53x+9/7OuUzIyVlwGwygx2B4D6WyBowViqRWa/HNZMIbxtZEsUp1Q+Ql0bql7g5GMzO55s0dYGZt98ynvDzYZDI4tVr88Pmg1b6CTFYVFTaSsikqjGJzvQ52lQoflErQRgRhGhVlfp9MdnWFdtNV/xhCbu4adMW7zKGJiRUhsHeSGMxqN8MaHxMCiwahvNjYYiTtPA0mlV72Bb6KoB3X9TwhAF30LEKjMaKy8lHEY6yqMmwICdTmsP5++6TJZAeJ/hntxmodx4LVCldnJzwWC/+f9FDxBywBl1gaf1P83e3m7/mBAe5xuxeg17/mdYLV3KgDG83I8A4nJSFYNvmukDig5u1p/q8sQknhEf6+vW2vyMPzk8X5L7MPgg1Jpb7go3kby+BsiltrgmDlSo6irWkfvM4E6FrTcDw+S+ShPMqnOsHr/QdkYhhpaEcMb4Tw9YtMibMFxzio6HwWLrD9Ig/lUX74OoctjY1NLDsc+B0JLTrkSw5hKzuHk5LDPA73RJNj8FloN8bFlaC8vAtTU3NY9XgwWV2Nj9nZcD55CotFiNiNNtsX+HyrvFHIP6JQYLT2JspK23m9kG4kGLUoterEhAurXi+mNRoMS6UYLy3FwzYTUlOr+RxFGmrK89fg4+H1rmBJEOBQq3n+YE0DzhS0rsOKi/VzNBd0c9BckYnMPfo+pKfXhtwMgaF26deHmmABD10A4VDa6fNrjcg/cQXMPxoOgtAQ07Vlae8RXUHBsPBjDIZtBH15KgestyX1s7Epec54N2W2u0XhaqtLQSR13JIv92nlM9z7SxTfb5AvhnuDc4z3FNO9uj1fzfrdbjb5YosXdv8G/4L+w/6I/l3YT44cXcbDQrmeAAAAAElFTkSuQmCC",
    nz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB20lEQVR4XmNYGV7+/f6T9//9M5b+Z1CpheP6ifv+nxHR/v+sayqKOAiHJ837fyWzCkMcL1auvc/QVzz341W3yP8X1Gz+bz9467+Kcz9Oy0By++um/QeB7z9+YxqID4MsAxEwQ0AWgixunnoAjGGWcWg3/p9UvQhsAQggO4poDLJs0/LDXw9uOv4fhK8cOP///cHj/99v2P7/68WrYMseVXeAxX4+evL/052H/y8fvABWC8J+sbMxDQViaetuDDGwZed1nf+BDCUHdwRiWlRVs+r/lZDU/zYRaA4BWXZq8rJfN6Yt+w/DN4H40fzV/1/NXwU28E5c3v/Xy9b/fzxnBVgOWW1KPGbisQ+a+n9H3cz/HFqNmJaBCagAKEWCUuY5aaP/L7fsgccZSAwEQCkQlBLRLcCHxS06US0DRTYo0mEJBJQY0BMIiA9LIKDEhJxAlJ2wJxaQRZfi8v9HJs2GWFbTt+ctLOkjG4Ir6YMcBQIgPSAxt4gZ/6/4xv13icSeWBoql/7X8piEGYzIWMCo9b+ZVcN/bZt2DDlkDPLVkqqZOH0Hx/gsozoetYxUDE4Q6OK0sGxG9cL/l11C/4elouVHWliWlbvo/8mSLnBqRpGjhWU48ahlVMFAewCHBv3w+yilbwAAAABJRU5ErkJggg==",
    om: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAy0lEQVR4XmN4r6v5/72uxn8Q/cnLFUzD8PdpU/5TEzCADP1gY/H/U0r8/0/ZGf8/+bj//xwfRzvLPnm7//+xbMn/Lw21/7/19f7/6O9LO8u+VJb9/1xc+P9Lcf7/z6lJ/78tXPD/o60VbSz7YGHy/0tW+v/PsZH/P6cl/3+vr0M7n33v6vz/wcoMnjC+dLT9f2+sTxvLcOHPSfFgC6mF8VpGbTxqGVXwCLVsWpDGf5tyNaphvJZVxKv/Z5igSj2MbsGoZWRhdAuGjWUARHNi8DvMOzMAAAAASUVORK5CYII=",
    pa: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABKklEQVR4XtWSu2oCQRSGp7TwASwstrTcWnwECx/Bx7Cw2MrKB9h0W1gIsRAEm0CmURQsRcgFMoKFkM1FXXRCNvHXWVjRQdSRQyAf/HA458AHM4cBEDAkaDQwtiyzpNMhwxWyhefhmTHjnJRx/qq3Ishlk8kKtn2ntyPIZNOpRKHQRSrVAmO3sKw2SqUhwnC92yGTKaT8iSRKViwO9DGtzPe/kMtxeN4Y+XxHH9PL4mfbr2NIZee4WuY4ow/1Lya5qfQjoUnmruuzbPZeqkMwybGjuQDxf2XfQuA3CPR2DK3ML5cxr9X0dgyNLGg28ZLJ4DGRwFMyCWHbWHJ+sAMqmWJRr+Nhe94qq15PHyvoZG+Og9n2xN+rVXy6rj5W0MnWUh6t96CTXcDfyjYby+ew8Df8cAAAAABJRU5ErkJggg==",
    pe: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABR0lEQVR4Xu2PzysEUQDH90/wF7hI+Q9cJaVsbTlI4YQsG+FEnNReJLvrworD5lekmGnZ/GiaIrPImi1SszPtHBQZWgdvqS2+9l3UPq/dUXPYtN/6vMN7ffr0XFpVjZkHxbAz1uFguujBeSjAzliHQyVWeqzDocxjBnnAjjqP5Gl/wT3rcLAfe8w+wXp/xmr6BC+pNWwKbkxcL8AklsOxr08Mxf0IxGfQvjwHRerD3U0QAWUK01eLzsboj5qjbTjWRMi7vUjEWnEherCtrcBz5HU29pbLomW/E2FpErdLDdAj9UiHmzAa60ZjtAevOfLL4WAvRjd4Povxw2EYYjV0oQ5GsBYbsh9j+XtHf0ZnfWQwIvuwt9WBVMQNdb0LPmkAakZ3PkZH7i+RkEM4O/BCUEIgZvLnjXU4/C1WbKzDoRIrPdbh8I9j32DYc0GrG5K3AAAAAElFTkSuQmCC",
    pf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABlUlEQVR4Xu2UXSuDYRzGn4/gI/gmSk6IrU1L0ybLIuFkI6TJS1tbS5G3NRYhLWaTZRsx0XZgSMKoYZqtZ4WD2YvMy2V7Du+e6T4YR351nfz7X/fvfnrqZu5KS/BXYcjBb+ZfVpQwAMKg5DMZxwd7hpDdjqejTXyln3LDd3KtEGE6We7At8AM0jYFHqfq8cAwSIxVILUswevOALldCDpZ9mqDE4WMAkTNXUBOxuplCBoqkVoQIHvpICt80Mnyt09ZpfC3NiBmaudkUX0LDtvkCE6KkPH0kBU+6GQZVyfSK3JsSYTYmNLAplZjTdOM6yYZJ8t/HcW/o5OllsRIzpbDW1sH1ZAFBrMbvToL7GIJN0/OV5EVPuhktp1bzKxfYVvUAJdQCe3EOkZqFHCVVWPOeQ3r9g1Z4YNO5vRFIFB7oNLtQtqxCHG3G8p+B7TTfjQO7uHglCUrfNDJ8kTiSYxazzFkOcFwLs36ffSZAvAexxB/zpDrfNDL8tzGEpyw3ejD+OoF7tkXcuUnwn/7XJGD38y/rCj5BpczBXnJ6oRwAAAAAElFTkSuQmCC",
    pg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABpUlEQVR4XrXTMUjDQBQG4AeCU4SCWDoU7JhJMjnHKTh1qCiITl3FCoIOXXR20MGxkElFcHSrICjYQR1czHiLNJPgXuH8X9vEXO4SU7CFjyTvLv3J35S2iC4HRKEkklMmCJ/7BaKvD6JXw4ZiLJg3zFViGAaSdYgecTIwbMy2CDfgGtZUQgljHlEwUa1r8AJ7NAouG/aMCC2MFap1BlZgk0ZhD+PjCWUFCmNYJLdWGw7GAWn8tOn9eWGWZQ2Pq0Rv30R95UZ+Ga4NIewOzrWg7DAO6na7stVqDa/LRJ99ouf4RgdO4Qx24Gkc9Aj7cAGzBcNYu92W9XpdmfnYK021bsAxdGAZrmC7QJht2/F5JKqUGWuN8Nt4COuwq60LJazZbMowDGW1WlWCer2edF03nmm1Ji3BEcxpa2pYrVaTnufFXxrhoEqlos39rFrNhBJmYqo1KbdWlfgzjJ82PUvLrfWXwF5zWPJ3K8rPr1Vgjx5WKpVkEATx/2wSObUKrOthrNFoSMdxtHkRGbUKrJnD/oOv1iowm14YS9QqcD3dMMa1vhPd/gB6jU9c7Mw0hAAAAABJRU5ErkJggg==",
    ph: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB8ElEQVR4XrWVPWgTYRjHb+jQsR0sGRy61A/ErYi0pYM4KIUODgbBRQfdVOjgEoljaTelDhYcKtjWGPCLUqJIsVixik0IfpA2PWs4zUeTpuZCrrn3ff8ml+uFPJxnkqYP/Dh473n+P96XlzvpxaKiDlx9DenkzH4jS7FEXgcvYDqwgYPDz2lDK5ElJZ7S+c9rENsBFHYYvJNhtA/6aGMrqOxMqB8APY3dKq3B7VmizXvFPMZ/1GIwhd5LATrULA4yoRkPnQlMPovCNfSUDjeKvUwUvkEotyxhubZyRdycCKGtf5aG1EutTKSnwDcfAEUFPDkBsCx4fAxCXbKkq7Echkbe0qB6IDsrS1L3wNfPg33pAZMvgm89AbhqtezWq+U4jrjnaKATVZnIfzSCheIFC3VZiMw0eOYRsLNRNWkRcMUDXS/gri+CjtN+GmyHLBWV303LRDGP5P2HCHX34nPnof9RlRnVwDH+WXiHryfO0EAnamU1FyRhf0G06A+sua/QoHogOzPL7uqz7DaU2+NYOXCUhtSLvcwoUyR0hs2pxwgf7qPDjeIgK1Xu/Sd8P3WODjVLRUY/xKU1yJdv0Oa9UpZFdR67bvxiuKbh1+gdBF3HaWMrMI+x9PPM+F8ifGyQNrQSWcrOv1EjZy/QF/uB/BcYtl1EVdT9cgAAAABJRU5ErkJggg==",
    pk: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABC0lEQVR4XmP4jwPwRHJTHTOgWwID6AqpgUctowomyTKROOH/yplKGOLEYqIts6qw/L/k4GIUMfk0ObDl4oliGOqxYaIsA/no6qOrYAuRxYO7gv8/efvkf/r0NAyDsWGiLAvvCf///df3/wIx/HAxENun1RvsiLw5eRgGY8NEWTZl25T/v//8BvsQ3QD1bDUMMVyYKMs613WAxUA+QTeAFEyUZaBgBAFQkGHzHbGYKMtA+NTtk2BxEG1UbIgiFz8p7r90shSGHnRMtGVaeVr/z949C5e/++Lu/2M3jv1/+OrB/4B2fwz12DDRloEwKAUmT0n6P2f3bHCeq1pSSZSPyLKMUjxqGVUwXS0DAL5Pc3UDgY6/AAAAAElFTkSuQmCC",
    pl: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAP0lEQVR4XmP4/////f/0AfcZQAS6KI3AqGVUAaOWUQUMZ8se6AX+viNi85/WGGTPqGUU41HLqIJHLaMKBtkDAFS/fqmeuTNOAAAAAElFTkSuQmCC",
    pm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    pn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADJElEQVR4Xq2Ta0iTURjHXw3DokIrxWT5Ojenpi03b/NCE9fGvOvIG27qnOa85EITynJRTaLATKpPSWKEgVlUoi7SIhT1Q6EISVioFdQXKz+kBmX/dt5h6tRcuQN/Duec5zy/c87zP9RYggrTHd0gbeb1W9xo6oWTsBYUt2aFng2O45VAhqHd/kxPxpYxRGS/4WIHJs43YIQjwrjqKOZGx0AtTFoDXQ+2FmR+7jue95lglkF/g64FWw9Ci+vMB1rrZKtBe19MLoORsVWQBZHTWYokmXw3hbnJD5gdGcWPqS8M9Nf8/DIYSfpt8KUZMDPLrH+dnsXA0PsVOZlXIJv+RcNufAZGesu19USRjbaSPsgLN91o3OH6wLiTt2L9v29m9PDBg0w/DKiEzPxjoQQVMglKZFLUxyainR+NkUAprgQKMRgsMd/M8l0Xavbx0zR+mupAGqkZqR2pEdlEYP0hYvQYz0B9QYHRp93ob7mNvGwFjhWp0NLaweS539mP2quZyNbnmGtm6UbiOuI+0ogbiSuJ24jrlrqxM0oM3aUqpNYkQKIV4WFzPRrTZCiLcYe+/CATn6nVQF0cg63cnEXrrwdZ7Z+1RUZBkO8NljwIe8M1KNTpoC0oQOPl08gr4MC4PxifB4Toe+SG0oo4M8wayIKWwkh/rbkVm1kh2OIpwwGZAJocFeoMZ2HQixGZysWJXBa65Lw/+ShrIGvB2p8Mwz2sHPzDbOzLpRGRmgL/FCF8FQLwFdFQVMhxq6kOb5SlzKenKE7NhGVSa+UcKoYzHQHvdDYCy2iwkjNAJ2XAUXcPHlnZ8IgUwdHfVC/OKTCcjcCcQuUIMD0TnRQMXqEAd7t60NB0HQ7aNmxLrkSIMgCbOEfM8RuFufKV0Fe7w1MqgYsqF+rj7sg/6QpWYRq2S1Wg47zgJj0Eil25cRiROF4CB78S8CsEiFG7QFbkCn4JG47BudgRFL8YawuYk68SPqI4hGf5ILHEFfEmmCidh118New5usVYW8AoryqcM0TAnq1BrOnfJWh4sKfVMBjCsCekeDHOJrAlsvMsgx23esU8IxPnN6aKqh8m+vk3AAAAAElFTkSuQmCC",
    pr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABhklEQVR4XmNwt1jxZauwxf+3DAw0xwxS7ld/MwR8+B9mPPP/ZU4pDAXUxHDLQJjb5+n/avWS/8+YOTAUUgOjWAbDcm6X/i+Q8sNQTClmkE96/w/dMhh2qPny//LDP/+pBfBaBsIswR/+Z0z/9v/9l3/oekkGBC2DYYHoj/+nbPv5/zcFHsVqWXTf1/8yyZ8wLARhnbzP//dc/I1uDlEAawJZffTX/+yZ3zAsQsZe5kv/n+FWwkgE+DDcMlDctK/9geKSz9///fdv+4phEQyz+774X6xZ/f8RCzeGwdgwhs/y53yHW2ZS8hnDAnTLyjUqiM6XGJZN3/Hz/+IDv/4fvvYbHHfoFsBwkMlckkscjATiXPcFTIOCFZTP0C0B+RbkEHIAhmW4sEjcx/9zdtMg6SNjkA9LFnynfab2aPzy//qTv+h6yAYYCQSEFV3P/V8t5owRwZRiFMv4vR/+b1LJ+f+SkQVDITUw2DIW/zf/Yw0n/b/OIY6hgJqYwc9s4ee9AoYYErTAAC90bOTAgFhQAAAAAElFTkSuQmCC",
    ps: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAmElEQVR4Xs3ToQ2AMBBA0ToGwJHACnST7kEYoYswAyHpDgxQV43H4o8zh6CEAO1duOSfuIqnqpRSIFh04MucD5zhBo+JoLiBYkdxHxjFhuKOMGoty20yJlhr5xzdYkdaAzgHqfMMy4S+wxLRH2MfEZpnWCJCc4stVbHZvgnt2M45usR8jZ+6w6chcyIIJYJQIggVHTiLDozt/0AWHxt8OJ4AAAAASUVORK5CYII=",
    pt: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABlElEQVR4Xu2UzSvDcRzH34cdkB085emiNE5TalKEaZGEdmAZeZ4hD3FQTFGT1JK1RCg1eZgtpRxIS8nDwcE/IBot5ea8Um9fcvv2+22ldtAOr9OnXq/D9/P5AnaEBIyGxoYwAf6BEBKxfxjrBgs7wLZxRFwG8C1XksSKeiy9H7ROgo0Cix0RRym40gwemyVRLCjHkkRocxvcsGbzQJdJb5OWPn06D81aLrcX0+uQZNFQjhnqQacTvCgu4NXICDc8RzzfC/DGaOROXRk9o+C7LFRDOTYxA/ZOgIs1aXQPDdMffObZ3Std1iK6zTqui/m2URKqoRyziXdq7gG3DAX0T80xEHxi8D5Mn6mC7qYSrk+BnipJqIZyrLwL7J4H1/qquW/N4uXpA0+WFnnbpWVrQyq9YnYjC9VQjqWYwOk5sLoxhXudJXzMz2Ok1sgtm55jg6BrFvyQhWoox77JaAEHF0RQrPrAePKns0FDXx+4K9b/RZZFQz32gwXUiaO2iKNerQSvcyRJrMQQ+yU+31UiFp1QXGNfiq3Fq9B5vTkAAAAASUVORK5CYII=",
    pw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABDUlEQVR4XmPwWnvtP70wA7oALfEItix4/Zn/kw82/D941uv/pYtm//ed8f3fsa/3f8D68xhqCWG8llXtmvf/3U2R///vMWDgB9dU/6dt3YKhBx/GaVnm1o3/v93hwrAEGb++Kf4/etMhDL24ME7LzlywwTAcG95wIg5DLy6M1bKIDUcxDMWFQcGMrh8XxmpZ0Y7lGIbiw8QmFqyWpWzZgWEgLvzzDjuGflwYq2Ug/OKGNIbB2PDJCw4YenFhnJb1HmjDMBgd/7nH/L90xxIMvbgwTstAeO2JRAwLkC0CZXZ0PfgwXstAuH73dHDJgWzJsXPO4ESErpYQJmgZMo7btB9DjBRMkmWU4lHLqIIB7kvsnU1zFXAAAAAASUVORK5CYII=",
    py: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA+klEQVR4XmO4qi13H4j/0wHfZwARWCRogUctowqms2X3Ivw23g3yOExrDLKH4f////f/kwBev379//Dhw/8PHDiALkUI3CfJsgsXLvwXFBX5L6el/N/b3/f/sWPH0JXgA8RbBvLNtGnT/rNI8v7Py/T875kR9n/Lli3/379/j64UFyDesuvXr//v7e39zyLD99/CWeG/Vbzn/3nz5v1//vw5ulJcgHjLvn///v/EiRP/QyPD/yuZaP3vndj//9y5c2BxIgHxloEAyBdr164FB+njx49JCUIQuM9QMe3ixpqZlw/TGoPsYWCwWHEfiP/TAd8ftYwaeBhbBgC47GKFU7RF3wAAAABJRU5ErkJggg==",
    qa: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA7ElEQVR4XmP49OzV7/84wIuL1/+fnLLk/6qQvP8TlZz/90rbUoLvM+Cz7PePn/8fHTv3/1DrjP/z7aPRNZOKcVv29/ef/1dWbvu/Pq7s/yQ1N3SN5GDclsHAry/f/t/efuj/IrckdM2kYtyWgYLw0rLN/2eZBKFrIhfjtgwZPDx0+v8Sz1R0zaRi3JaB4uziog3UsASGcVsGA+/vPwFbStM4AwFQwthd3v1/rnUEukZyMH7Lvrx6+//a2p3/txe0/p9h4I+umVQ8iCyjazCCAF0SyIAkfRCgeaYekOKKLgUx3asYulWeIEDtZgEAQLxmWPM1IrwAAAAASUVORK5CYII=",
    re: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    ro: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAT0lEQVR4Xu3NsRWAMBDD0BshKzAC+2a2ZJRALftxHZWL30pV99yv8+Wsaq1rdHZl1jFxykzjZOKUmcbJxCkzjZOJU2YaJxOnzDROJk7/zh63sbM1ruUi+AAAAABJRU5ErkJggg==",
    rs: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACJklEQVR4Xt2S7UsTARzH9wf0j4QWvcnF5sNQFFOi3ENaGWKiprVe9OImOZaG5TLk7Fav3FLEMGtt03Q11HmXm7XRA4nlRHwZ9FJ64ZuCT+rLu52cEr3oCx+O+/H98uHgTMtFxfwrTOpDPpasFs3tMOwrSxVZSVXXELpcybs6x967unMQdGVKUy2J204SdiszYg2LZ08y7asn3nle0zWKrix1vZx0dxHzDWbS/SdYtp9iwWMm0W7TdI2iLyu1sthXyPuhAlal46TFo8S8hSQrzJquUUw9ljrUDFRdYtR+hchNF1HhDFHPOWI7z1ce597dX+bSbIxgOmITUFNW38vqVTeR6lIUSSDsvsG02EWsyowiilhL2zUbI+jKsm8VZHGI9R4vmx8/kRsaJNN3j7WVL5RXtmo2RsgrK64TWEnOs5JOEWpsZM5/n5mOThJTUaZGQpyudWs2Rsgr2/2yzUyG77lvBBwOZqQA4ZY2Xr98QTYRx1bRptkYQV+mJNmQZUKCh/j4OLP9fuSJCTayy1hKWjQbI+jKPo+O8XVH8rS5mbmHAWKt7aSfjLAWiRz+Bxl/8wE1z+JZJi80oNztIP5IIhyQWBgeRh5089zpIhyRNRsjmNDJrMeFVF9A0Oelq0tg9IGfx45jhK9Vq6uGoyv7kcsx0VTC2J1bDPh8BLq7CV608HN9XV01HF3Zbn5vb7MUDDLp6yU1HOLX1pa6cqDsK/vb+X9lfwCHFrTETN2x+wAAAABJRU5ErkJggg==",
    ru: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAYklEQVR4XmP4/////f/0AfcZQAS6KI3AqGVUAXS2bMnO+y8XbL33n9YYZA+DjP+G3wyWy/7TGoPtGbWMUjzMLWuySvjbahD4n9YYZA/DPgP9f1e15f7TGoPsGbWMYjy8LQMAdNKYfXrr0wcAAAAASUVORK5CYII=",
    rw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA00lEQVR4XmOQWXbkH8PCe/9pjcH2DGnLhBafBWOxJSdRxKlqGcvC2/9llx7677xq7v+ote1gGtlCqlrGvuj6f6MVa/+v3mb5f+MOk/8ztvj+11++ES5PVcs4Ft74b7Nyyf/ZWzz/39/L9n/aFj8wH+QIkDxVLQMFI8hnMWtb/hdtKPifsLbxv8LS/XB5qloGwyrLdv9XXrYHbBH3oitwcZpYBvIhCKOL08QyXBhsz+NjHL9/XWL8T2sMsmfUMoox/S1TSLC9D8T/6YDvj1pGDUxfywDpJAQ8pdjRUgAAAABJRU5ErkJggg==",
    sa: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABuklEQVR4Xu2USyhEURjHZ2FhaUlRFoosPLOwIg2SRzQZlFeeEWNCBjNezQiNR6JYGENkpmQM8mgYjyHj/cxMlEeUnZ39372nFPfSmTSUWPy65351vt/5zv2+K/DQCPBTCLiB7+QPyry0Lu+eLN4jrvAdc4PfuBtZc/fQ+FQWNxMGra0fih0JYo2hKDKLUbVZALm1HK37MuivhhFtDEbXUQsipvyhueiD1JKLvJUUXi6qrHg1DY/PD1AfNiJ3OQmBOnekLkSh77QNvSetaN6tQsehAqo9GSNIhu5Sg6bdStRby3i5qLIQvScRGa4nMHc7ifwVEYzXOkRNB2DgTI0Igz9G7QOkGslGNmq3S2C80aN6q5CXiyoLmHBHwlw4qaTQnEqup2GnAsv3s7A9naLnWAmFVcLEpChZy0DddimUezUYPO/m5aLKskzxaD+Qo8KSg/SlGOYbaYks25QI0UIkhNNBKFvPhHhRSA5UYBYhZT6SVMjNRZV9hbed+xFOldH4fTLa9b1ClYVP+kDFDDHbLC3MbHUeNRHYd7Zh2LXpbhY6+xBvLxeqzBHYX1cgMyrcOBenyBzlX+YUXgB6ee10+iDbKQAAAABJRU5ErkJggg==",
    sb: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB3ElEQVR4XrWTv0sCcRTAv4ODgzQ1NDg4SEhEXGXgICGuDg2ODhX+AQ0ODo4OBlISzv3ClpaooDWkswxsE7KyVBKz0jT6ofmjXr7TO+w89c704MMdd++9z73v930JIZfxGqBURkGhuAJ8FkKjuW15J52ajKJi4HZnweF4hvHxuz8Bw8PXYDAkIBgsMHe5PCJQRCw1GXaVTlcgHi8zxflBXm8O8LJaH1q+SaMmGxm5AYslxRSTyep/rtPFuSCzOQlabQzm5pICBaTQ2DMWXCab7RHC4S9wubKAS9ya1Cs8GYJdVCo/4PO9CiT0hmF6CziZXp8Atbo+cdgN7qPJdM8F4zLzC4gBJefbE+9wQYCR4Z6EQkWg6U9m4pqDcWA8nhfI56vgdGY6Ho92EuSJJt9cZ5FIiRlvfhJitz9BNFr602k7UHK2SRWaJUseAnJrozP8e0SligqeI/ZAdzrYHSULDVDGT5QCSk43Jous5Jkm1RbJf2V6agcC61MlUZJeZdToHhytzXKdZGhS6SqRKkPJocdQZiXZACmLloiV9UXSTYaSg1VjtWm6vnqWtJPxJUk/KcwvE5AtCiRLhZWhZH/F+MNKUn7y0TcJy8zYbmrgEpbc8VAeJekT8jYwSYNffuH6lw3sk1IAAAAASUVORK5CYII=",
    sc: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACH0lEQVR4Xq2UMWgTYRiGfyXKUU7IEKlgFiEUwSIHWszQIRBcqlAhYIfg1EqHIBQ6iHQI2kEhgQwliW1RwVCEROiQocgNEQcdChZUuCFDKBWkRClSaalHff1+j7R3990lOfCDZzmO5znuvvtFVDwxhVhEv8wkbgMQ/bNPTBJCQASJhZUCDowQF/rRIjQrFDj24fEFLvRjjQgfhwLFJrS7gOkhdSPvyTojgWJKqIi9jVNc7KZNJHkkUKw+e5mL3awTUR4IFBu7eM/aKLfczgIR4nI3PWM7jQEu77BLpLnUj66xauYKD3RoEsNc2A3f2Ej0Af7snOARSY1QuawXvrHt+hkekWs9yyV9EYl4x/Kp6zz0jUh4SLqhqvRN04Cu04OaPDYUeYTDtuv1NYhzHjIvFMUKrK7SFu/DPizWfHHWGcqJ3mstA+PjQKVCG7rrCNjHEXt446a8ZCHXOuUh7hCiAzmZBJaXuwbscxQbVHMwWyflJeAzEfMISEZHgXKZjqa228WHXuPelw1svnmFtZf3j2OfFs7jX6gi+FrH40ChAGxtuXVHc9A08FWvobGSRf5pCreKwxCLwomMTcXvWEdSxhbQNGB+nn7epkNqbraw/baO9WoOpaU0JooawmWFi724pGR//9JPA1cpEIsBc3OAYeDwexs/3uv4+LqAlWfTmCrGMVhWuSAItbGRn8bkNbzLT6P6PIOZUgJDpQi/8T/wFyQM5iWjjGNIAAAAAElFTkSuQmCC",
    sd: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA+0lEQVR4XmOISWb49JyP4f9/BtpjBplOht8SPQz/92hgSlIbgy1jmMXwn2UGw/8GX4b/v5kwFVELwy2DYZdChv+0ClYMy0CYVsGK1TJaBSuD+CTWr+gWIWPzZu73D220Tv7X1z9MKWaQWSaD1WfIWGKJxP89T/b8pxQQZRkIs8xh+d9wtuH/77+/0c0gGhBtGQy7bHX5//zrc3RziAKD0zK6BSPVEgjXdC68SV96svT73PrckzU1NYcpxQwMODI1AzBTMwAzNQMwUzOAMiRVMDbLgMUVgwa6QmpgdMuABTEDH7oiamGYZTQJNnQMsoxmwYaOgc0C2gUbKgYAqNY2dVJpCUIAAAAASUVORK5CYII=",
    se: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAaklEQVR4XmNgyFr+HxdetcZi/78zDP9hOLQ7fz+6GpIwhgASHrWMaIwhgIRHLSMaYwggYapbhmwYOv5/hgHFMiA+j66GFDxqGQxTZhlGJCJhqicQDAEkPGoZ0RhDAAmPWkY0xhBAwtS2DAAYcMytflSo3wAAAABJRU5ErkJggg==",
    sg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA+klEQVR4XmO4z8Dwn16YAZnzgIPj/6vwcDAGsdEVU4rhlj3R0Pj/6/bt/9+2b///WEHh/yMJif+voqP/P2BhwdBELoZb9uv69f9/378HW/JQQACMXycng+VAbHSN5GCwZU8NDP6DwMf+/v+PRETAvoP5COTjT7NnY2gkB4Mte2ZhAbbsfXMz2BIYBsmBfEWtoARbBkoMf54////z8mWw4HNn5//vqqvB4l/Xr///kIcHQyM5GB5nL/39///7/fv/l9Wr/z9WVgYHJ0j8iYoKhiZyMUrSf6qj8/9Ddzc4OKnlG2SMYhmtMQM4ZdAJjFpGFTBqGVXAqGVUAQAQN1GAtpV/tQAAAABJRU5ErkJggg==",
    sh: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADMklEQVR4Xq2VfyyUcRzHv5VNa7bWZpFwYrhNlEs1nU6JaJwprR+bHyOdH3fuDN2dH5H5VXFY5Ve5UX+kWIxV//inMrayMWPk58N0aTRbWfmj9M730ZE7SZ0/Xt8/vs/neb+e7+f5PHtIv0gx/6WzB42NXbC0VIAQEUt1dRs6dzhg4NaDpb2tW8XIk1ZjJCoR09W1sOUol66tA4aEBt+Zepucg3epufikmYJC8QRGRjF6Mh8vFXpTCjAuTcPch4/Izn7G1q0S+icYQhcTk3iUy2swEibBTF0z+vsn0dExxsrGKh+iKXPhNCFxmG19jZaWPnC5GbpB64Eho09ffqchq0FlmqxCvX0t9jZy3cC1YEi3k+AHDf0fDlnLdAPXgiGDeeXzk9dvYzVoIG2f7r4WJ06SbuBaMITDSZmwsUlBZmYzvs7OYbKwDKNXC9DXPc7KJqoeoadHAzqxY9HJeK6qw/792aD3/POAuLpma1pbh/D5RTt7ioZ0NczNk1dMIw2VyR5jRjON97klGJCkI/JcKRsiFMqQk3MBDQ0+UKt5qCjjo7eXh/Z2N9TXC5GUdA7u7mwHGDLeNfSNjnNPmgoC/o2lJ9EdfQr9Dmtr32BucASj4fFwtk5CTU0QAMLS1GSB4nw/qFS7lvYokZFxizIXq0QN7b1uS0xNE9kBsLfUfy9USttobBS9QkYRixwQGOgMpdJKX7a46PV33fwuGx4mKCsjC+1blm+oLDWrBDcrKlFwV404eSrCY+IQnRCNoycEiJAkoPj+Q0TFFtJaxmCZJOAIrkl5qDxviYiceghOXwbfTwi7vTwEJxShuA3w9M6jtYzBsiAvb9RdIEhLJDh1SYmAUBEuStPB5fHhFyZHZtUr8NzSaC1jsMyTH4LSkIX3EkTg5mkOt+O+CMtQQ5RbjkB/IUplWdi+XUxrGYNlZmZiiM8YIz90Cxx9OHA64IR9/h44ZLsZZ7kEngcPa2sZg2UUH18BcoWbwI+6AgfJPdgpKmArvw0LUSy27ZRq65gNkVFcTsaCE5UHTmklLFT52C1Twv4YO4VamA2TURw9MrBHKgc3qwgmpst//V8wGyr7C8xPKw3wrwqDE6kAAAAASUVORK5CYII=",
    si: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA+ElEQVR4XmP4T0fAgC5ASzBwlv159/Z/aljPf3vXlv/W3vX/7f1q/3u7d/0/uHgLsjKyAYplv588+i9v0fefw3LOf/2AFjANwtOSGpCVkQ1QLPv76eN/LbOO/wL28//7Fuz4L+66CGzZspIeZGVkA4bFW2/9R8ZhXm3/bzx4///D55//X7z59r+g59j/2TmdKGrIxQywoILh4siO/w+eff5/5/FHMJ6x4tJ/fTNEkFKCMSwzNG3639G35//Ve+/+bzpw/3+wbzeGJnIxhmUgLGPR/z/VvQoYf+0YcpRgrJbRCg9jy0AZll6Y4Z6mxH964VHLqIKHr2UASTqMbqftnJkAAAAASUVORK5CYII=",
    sj: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAm0lEQVR4XmN4r617H4j/Y8Nfq6r/33/y5j+DRgYYL1h//P/P9Rsw1BGJ7zOACCwSYDxqGZF41DIqWfatr//t96nT/mPDv/bsxbDsz/XrGOqIwSB7GI7sPf1n/8mb/3Hh5VtPwy2r6F2PIU8sBtnDIG9f/g9mGC0x2B66WkbXYKRrAgElSSzJFIypnvRBBBYJMB61jEg8ahl1LAMAwLQh5Muq1c0AAAAASUVORK5CYII=",
    sk: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABnElEQVR4XmN48vLTv/90ACB7GEYtoxQMHsveyajC8deSqv+fQmPgfBCbVAC2bO6a838X77nzHxmfOnMXbOh7df3/nwIj/v+Yv/j/14paMBsk/tHd7//G4w9R9BDCIHsYVD2m/Ob2W/QfGU+auhts6AdT2/+/z57//+fGzf+/T535/2v3Poi4hcN/j6qdKHoIYZA9eC0D+eRLWs7/n6vW/v8+cer/r/UtYIuoalnnpF1gyz4nZf7/PmPO/9/HTkAsnDLj/0cH9/8fbFz+O5ZuwzAQH8ZpWXDT3v/vtYzhCeJb7ySUBPI5OfO/WNgyDAPxYZyWycWs/P8pPu3/HnXH/3cU9P+HOdX97zBL/H9RyeT/OWXz//faJ2MYRgjjtAyEp0za/l/UZ85/ft8FcDEQ28qr/3900y4M9YQw2LJ5ukEvZ+oH/0fH8yyj/69pmv+f3w9hmaLPzP8HuxZgqCUGg+xheCeteh85AyNjUD471zT1v6PfhP/pkX3/H5c1YKghGgPtwWsZDH/yCwUnd3RxkjCxllEFj1pGFQy0BwBh4cUQDanWCAAAAABJRU5ErkJggg==",
    sl: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAXUlEQVR4XmNgOMtwH4j/0wHfZwATmBK0wKOWUQXT2TKpS1K7RC6KnKc1BtnD8P////v/6QPuj1pGDTCcLauoeLqxpubpYVpjkD0MwFwNytn/6YDvj1pGDXx/+FoGAPk9PihQs9G4AAAAAElFTkSuQmCC",
    sm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACF0lEQVR4Xu2N30tTYRyHd9FNN9FFE4IgJCgMKgLrKkORGCFFYBFURgVlIP0gMzQqxrQlpLD8hdPW5sk2txa1H8etpjPTOm6ZW50gV9HxwsUCoYv+gCct2MVZ6RGsKx/4vC/vy/fzfXSAwv9B0c0d6t9/xLLsN4qiIMsycqzx171ItMtEUeSutYF3vnbG7McY7G1EejWkHpsP7TJ/xM8H2wE+7V5Bsmo130pX8TnUrR6bD22ynqc9CC8Fwq5iJsPbGfMWIvu3EA1doD7VxkTmvbryJ7TJjtfvxeM5xcjwYboSHxFexxEkickXRbQmmzgZu8L0j4y6pmZhWSqTwtx5hhZHMVYpiiU+g3MijWN8GvdwHQ6pmnMxI9LXN+qqGkW3tv+7Mhv+Fr1rlELbJU7fO0qf5KEzliYop/GMTxEcqKS0v50SXw1bw56crioLy9bYn7PTVMI2434eBSq4HbTQGmzgTqCZ+2IZhoc32NFvYV3gS0530TK9M8HKa0co7yyh+nEtXb4KOiL76HUf4sSDixRFb7FrwER+IJnTXZQsz/6WPG+KgqbL6GsN1AgmOp6YabHX0ew2U+51UTbUxp5Rf3ZevUOzbLNNojKY4GpoHHMojtEZ4Lytm2cDNzlr92L2RrguxqhyDXJQiLLBOpKzQ7NsLgWBNOvFmezbEBlkU2hq9o5m/zaKGfL7UjldVRaWLWGWZUsS5ScaxNz9e4wpMwAAAABJRU5ErkJggg==",
    sn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAx0lEQVR4XmPgLlK7D8T/8eH//xkI4j0MBPF9hlHLCGEshqPjUctQDT52jxNDDIvh6Jg8yyx75f///stIe8suPmEHi6H7Dovh6Jg4y77/Zvyfv0b8v1aL4n+5WmWwGIgG8aMXSP7/8I0J3WBsmDjLQC4HBVvrTmEUcZADYMGJxXB0TLxlIPzkAwuK+MkHHNQPRpiBM48I/HeZLAuOt4BZ0v+btovQzrL9t7jgwQaiN1/moZ1l+DAWw9HxqGWYhqNjLIaj42FsGQCjk1ioKpg0VAAAAABJRU5ErkJggg==",
    so: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAzklEQVR4XmNwWPb/P70wA7oALfGoZVTBg9+yCacxxYjBJFuWuPX//2+///93W4kpRwiTbNnSq//BoPEIphwhTNCylO3//2+58///9rsQ/OEHxLKHHxFi627+/x+6AVMvOiZoGQhn7YIYjg2cf/n/f8RGTD3YMFGWgTAojq6+RrVo131Mdfgw0ZY5L0cE4eefEPrGW0x1+DDRllUcgKRCULIHWTz/0v//f/79/x+9GVMtLky0ZS3HMOMGlA2qD2GqxYWJtowaeNQyqmC6WgYAm806p6cnCwAAAAAASUVORK5CYII=",
    sr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAzElEQVR4XmMwr7O/D8T/6YDvM4AILBK0wMPZspcfX/3+TwcAsoe+lu1Sc/63hUv3Pyl4p4wOhhghDLKHLMvuTFbCECOEybJsn57W/zcnZME0uhw+TLRl24V1/l+tUv7/dIP8/+c75cGWgWgQHyQOkkfXg46JtgyGz8argS2CYRAfXQ0uTLJle1S1USwD8dHV4MIkW3Y+VfX/jRZlcGoE0SA+uhpcmGTL9huiJgp0Pj4MtoyumZquloEKSCyFJi0wnUt9EIFFghaYvpYBAFaoAMTTWq2WAAAAAElFTkSuQmCC",
    ss: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABXElEQVR4XmPgMqr6wiKo+Z+BgYHW+D4Dr/3s3/zu6/9z6RX/Z+IQRldATYywDIxdV/1nVw7/z8DEiq6QGhjNMijmtZ/zn1XCBl0xpRi7ZTDMbdb2n5lPBV0TuRi/ZWDstuY/p3bWf0Z2AXTNpOL7DFrRO/BbBsVywVv+96+89f/3n3//yQT3GTScF/xDNzihqgzDMhjWcZj1f56S6/9bQlIk4Xu6Jr+xWvb2svD/iNKa/xNmhP43jJmOYSEIu1q2/98lZYhhKC6MYpmw55r/blkd/6fMDvr/5y4nGPdMC8ewBBkLAeMz1bDg/1lRZQzD0fHAWYaMaR6MyJhmCYSuSZ/PbyF+yzzW/udJrP3P3mz9n73TgBKM3zLesIn/Oau90DWRi7FbBhT7z1UUg66YUoxmGTD5c2fk/2dvN0ZXSA2MsIwntuU/R5MdugJqYmCpH935hbPKD12CFvg+AL3s33CX0vXaAAAAAElFTkSuQmCC",
    st: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABJElEQVR4Xr3VMWvCQBjG8QexUnBxLWTqKKV07CLo5tDNoYtjvkGhX6FDHTKVUhGh7dhOleKgOPoBHNxcHBwcpCgELPo0hxyau0s69HrDf0nuvV8yXIJbH5tsE0TLQf1zbJ8vQSegwL5yoBNQYhI8fjQsstXgbI+JukUw/2BYaKOJF8dEwwuw+g6WP+2G5Sm+VUy0qoDbJUjaKxH7DzAVk+DHmz4om07B0Ui/bioVGx6BQRYs5sHXNhiG8eFOB/R9sF4Hez19c7VUTHSdiRZht7E6vFiAngcWCuB8rt9X+xW7r+yeOglrNKK3D8DZTL+vloqFN/rAX0rEbEMi46F+qekH0kYYn8Sxu6rhM2OrQ+ypZFhgM4k5+cUIzAkkCq6wdgJF/QCoC1c9ql7vBwAAAABJRU5ErkJggg==",
    sv: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA+klEQVR4XmPgd19/H4j/0wHfZwARWCRogUctowqms2WpnWdeZvSc/U9rDLKH4enrb7//Ewv+fv7//+fj/0/u7v3//9dzIP87ugqcAGQP8Zb9+/2/rS35v1Nk9v+jW1b+d47K/t/fXQhxABGANMt+3PkvZu7/f9Pcvv/zS9P+n9y97r+YhS9Q/C66SqyANMuAwaboGPe/anLo/4Iqm/+uOSH/OQxj/////RpdJVZAmmXA4PIM1P2vYO71X1Qv6r+Gtef/kChjouONNMtA4OeT/76hlv8FJBX/u/iYg4OWWAC2jK5JH5TZsGRAWmA6lyAgAosELfCoZVTB9wFi1HLYETMNBwAAAABJRU5ErkJggg==",
    sx: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABwklEQVR4XrWS3StDYRzHd+Gv4FJNwj1SbkgKiaTccUHmrUh5Ky+lmNeYhciSku3Ky5mXsdnFkuUkzTKvw1w4hkPC6pgv50wzz5SXnfOrz805z3M+PZ/zyF5OXRSbnMXcRCdAamQAnPB6mYeqBpp8KTY+mW84z+Kq6TYuiSMXiUWgTJjX61taqqxBMmEkyvq9zDeiZ/0iu3RZcb6dir35eBzutAjPxMzqlz0Pj8DeXI/T6lysFKVhvSQbjKLi/XycaFk/ZRMa5FMKFE9OYFJvgGprH3PNHR9nFibkrIKMZS/AqtUo7OhD/6AKOp0OjV29MNa1wWbbDBSGlFWQbWwkg+1WIqe0Aj0DKuza7VDU1GKhsR3WrSKcnc34ZYz7kQ5P1DCyyCH8GV42v5aCe80IWhpa0T81A6NtD519Q9jPK4DD2YSjk2new2n1h6awKDUX9JHfwst2HOPQLssxO5YOVtmFx/JKWEbrcOzKhMmRAY/nicktW6KDNv8VXsa93zi9QQOKioHREgutQQ6zOQJGayWu3O7tf2cj4WX+H/J1Qs9Ggm9kXu+rONlISFlIt+0nAmTiZyPhZZJlIzlw3lGSZSN4A0RjC60qqMAZAAAAAElFTkSuQmCC",
    sy: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA3klEQVR4XmP4z8BwH4j/0wHfZwARWCRogUctowqmt2UGBqv/a2vvpzkG2gO08v/V//QBV/FatuLOCnQhvOD7n+//N9zfgC4MA9gtu/3x9v+Ugyn/JRZL/K84WfH/86/P6EowwOHnh//7bPf5r7FS43/PxZ7/v//+RleC3TIQaDjT8J9jDsf//U/3o0vhBAE7A/7zzOP5//zrc3QpEMBt2Z4ne/6//v76//GXx9GlcAKQnvuf7oNDBgvAbRkNwFUGPT29tSoqKsdojUH2MADBVSD+TwcMsmfUMorxMLYMAOnOpYSCS6jFAAAAAElFTkSuQmCC",
    sz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACUklEQVR4Xr2VX2hSURzHL8Wa85pIc5oba652m9seJrGcYi3/dNdGgS7KekkiB3sYI4hohLBIpKekjdYtl7liRVQjLKjYwxAScb0k0YP55IujyL1UENTLt+OFa/7b8MV74MOBH7/f/ZzzO4dzqSH3CsSCKg/UE3FlN25ehlhQSFMQC+qVTIZaCdM0uNZWBE0mPOrowD2pFC+r5G1GTbKQXI4Jkxl7+2zYtr0BsVgM+fFnYwPvZ2YQVioraqpRIbtPVlvMFa0WvQwDhrGDdS1A22VFNBrlZcL4mc1i3mhEsKiO02jwWKfbXBbeRZJ0EizadvB4R3ugVrXA4XDAeNgJdngaBvMYZCQ3Ho8jEokgk8nw8/evWcydHcDdIw144jbjrXcK8clJPFepSmXhtibM9zdiwdBYEE2P9JGP0qAoCh6Phxe6XGdwlB3lY4FAAKFQCKlUip9zuRz+/v6F4LlBcKcG8OaCDc8MEszpaSzpmoplUjgsbgyPeHFLL8fyIEk6cQBS0o5imTDnY36/v0L25fMnrI5b+fqnByUYtxyH/fQdXOrZ91/GKVpwkr2KoWPX8JDcOGHbs3o9lM3NvMBisRRmp9OJZDJZ0saPa2tYtdsLtYsyOcYM53GI9eLi7v2lZ/ZApYWvrbfkQPOEurvBdHbyuxHQk0XkJcL4lk7jndVaUcvROzG1px+zpEMlsq1YVigwQW6bRq3mZTpyyxKJBH6sr+ODz4fXJF5eU42aZAJLpMW3yZW+TnYWbG/Hiyo5WyHuc1X+WNYTcX8x5YF6IqrsH3XIt/yFwkbvAAAAAElFTkSuQmCC",
    tc: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADJElEQVR4Xq2Va0hTYRjHj7lo3Q0jjVbah8IgSIrCD0ULyoKoFGeYflippSGVWMzJMFGIQtdapEJq5Rp2sbRRpqOyOa2hXZw5bHl9g6Y2Q7ObFTn/+b6jVWutC+fD73x43uc8v3P5n/NybdJEfDCbodU2YvbsNHDcHoZUeg6twcFoF4shFitddZEoHXqZEj0xMTBqalz1v4Bw2zbkjrbtPQCbXI4hmx0JCRqPMoEgGVm7C9Eh2Y5XJSWwWHqxenWu+0BvEG788EUoTEH+/gJ0RUXhtU6HhoZOyOWVLllKshaP92fgeWIi3tv6kJ5eweQeBnqDcFcLb44ZL94F5UFFHWzFZzFiseBTD0GrSARrWBje1jdguKoKdnMbGiuNrJdSkFPuPtAbhGsWLcAjjvsvmkJXuQ/0BuEsWyLZo/JEs1AIs5/fL/VvmCRS94HeIFxq6mVHVtZ1ZGffQG2tFR/7X8KuVmPweZ/rnQ0Pj8Dx7h16T5xEjeY266Xn0BB5GPo7CAsITZXV2s9S1hGzA4pd+YiPL3XJwsPVbPjbLsJC0pSaieXLst2H/QnCqdV3HDQQ3RIJ+37od0QX3aNPayEhh2EwtOONXs+Sq4x31uk5wcEZvyUw8JBTViQr/lwdkYDozaqfroTebc2mWFRF72WSH9fi4s6gtMiA/K3On4DdcgqdujAMGNZirHUdw9Ey/s4vrMDQ/TUwG0qcMufhl1v+JwZbZGg5HoTyfWI8Ui2Co8EH/Zpp0Epn4vYRIfRlMtpHeJM9Uy1G/cGdsKliMGr0wUDZFFyI9ceTU5PxsDqH9hFeZC9MqbDrJsGk2AjLyaXQpgkwohegIskPn2t9YdJl0T7Ci6y5WsEeXfcVH0SsnICUSf4w5k3EU/V09F3zxaXTx2gf4UVWkKtkMoo4cipWLJmF6MRpztq9iUjaxVJLeJHR6Dseh+JD3QQszAjAvLQAhJYuYLKPLZGgP3qOLxmlUKmGsXwG5isCMfeICL5Hg9Ctm4N9e1x7IeFNRrl1OQ95Sn+oymbifLEIhXnfN12ObxllZ9z4Ln4vE+HrWSh+hPAu8wL5Cg0y6HnlofcGAAAAAElFTkSuQmCC",
    td: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAO0lEQVR4Xu3NsQ0AIAzEwBfLMnaKjJHiSY+AHrlwZ+kkzeh8q2qkLR8rZY9+FALbADAwMDAwsFvxL7YA5lBySSx2bb0AAAAASUVORK5CYII=",
    tf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABUElEQVR4XmOQsV74j0F56n8Yvv/4039k8N4l6P9bTUs4LsxeDVdLIr7PMGrZqGV48HC2zC5y/TOHqA3/icUSFvPRDSEW32cAE5gSJOPtBx+CQwUZL998C1kN5ZZpuC0D0wKGc/4r2C/6v3r7nf/rd937H120GyzGojb9v4rTEpAayiwDGQQyPL50z38e3Vlgw+evuQ72Vffs82D54raj/2evvPqfVX36A4osg1kIwiDD++ddAFtWP/EUOAire0/859CaAcZge8AEFkNIwQY+K/8/fv4Z7KPrd979P37+BZh+/uorLAhBmDqW+adv+++dsuW/e8Lm/99//Pn//uOP/86xG+HiUHXUsQyEQYkDRIOCML/5MIoYFFPHMlCcgZK+Tfg6cEIB8UG+BKVKJHXUsQyEYQkhOHsHOPMjJQwYpp5lMAzKBiAL0cUZaGEZHnwfAE1QRZ5aLc2mAAAAAElFTkSuQmCC",
    tg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAzElEQVR4XmM4LMTw7wYDw39isVYpw3/BNvIww8iy7LaIyP+nwcEYFlFs2R1Jht/oBj5PTv7/cfFiDItA+Ndxhv//H5OHUSx75Oz8//fz5/9h4N/v3/9f5ufTxjIQvq+jA7fsVXEx7XwGwqAg/Lx+/f/X1dX/P61eTV3LjgmjJhCQz2DsByYm/2+ysKBY5lLP8F9/InkYa2rEhylKjcPXsof7GZ492AuMH2LxVYb/D2+Qhxn+P2G4j55qaIWHsWU6Exh+o0ckrfCoZVTBAJava2Uy1uc2AAAAAElFTkSuQmCC",
    th: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAf0lEQVR4XmN4JSPz+zkDw39aY5A9DMPXsi8dHW8/NzT8pzUG2cPw////+//pA+7T17KDJ54/23/s2X9aY5A9DDKmy34zSM/6T2sMtmfUMkrxMLesY8qFtw29Z//TGoPsoW+mBhHoojQC9xm+LVny8tuCBf9pjoH20LeKGbaWAQDMtEl0Jq/OrQAAAABJRU5ErkJggg==",
    tj: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABCUlEQVR4XmM4w8Dwnx74qIfdRwZ0QVrhUcuogsGW3XRw+E8PfCgr5g3Df1LA3+/////5/P/PywUIPpFg59Wdt4m27N+v1/9/3yuBsL9eRuETA4i27O/bLf//fb8P4QB99vfTSYTc6xX///18DufjAkRbBjbs93sw++/n0///POmGByHYEUAHEALEWQbyyaslKEJ/325GcJDjEA8gzjIg+Pflwv9/Px7///tux/8/jzv+/75f/v/P8xlAX90Gi4PikBAg2jIwAAYj2MIvF4FxdgoYnOfAfGKCEARIsuzvx8NgX4GCDI6BfJA4MQBsmUOPw396YOsu63UMDGkM/+mC0xnmj1pGOaa3ZQCRmm0dYfRFYQAAAABJRU5ErkJggg==",
    tk: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABaUlEQVR4XmNgUK69z6BS+5/mGGTPyLGMRb0eUyE1MDbLootW/zfwnYqpmAgsYVr4v6/V/L+GfSaGHFbLyME8OuX/m2pt/387zfJ/3zJ5DHkwJmSZf8bS/xzajRjiyDg6KeD/o318//9dZABjEB9dDRjDLMtu2PKfR68ZQ4GCfS+GGFzOMvf/rsWKcEtgOD7VD0MtimUSlp2Ykjgwi1r1/+Ii1/+fTrJhWATC5aXOGHpQLMOQwIFBvjm0QhbDAmS8aLIuhj6SLfOPCvv/7hgHhuHoGJRIQKkSXT9RloFS2rRuYwxD8WFQykQ3B6tlwdnL/2u4TQSzDVxS/1/bJoJhGCEMik8TjxTCloEsUrDrBEf0r/NMGAYRi0HZASU4sVnGoVX5v63BGpw5YfjWDqH/9/YIkIyPrZb+39Vk+d/GNwG7ZaB8Aipy6qvscWKQAfMm6GPgWb2GGGpB8eccFIPdMprhUcuogoH2AAAq1+4UhIwBOQAAAABJRU5ErkJggg==",
    tl: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABcklEQVR4XmOINGX9fdSC9/8ZZv7/pxloixnkRBn/CfMz/l9fzvn/tgdtLQVbxsDA8B+EaxLY/r9bxEMzS1EsA2EnY+b/D9dx//+0lPqWYlgGwuJCjP+393H+/3GAB2zpHVc+DI3kYKyWgTALMyRYv+zlAVv6fg7v/5vWlFmK0zLkYH26kRtsIaWWoliWnJz8n4eHB8yG0SAsLcr4f99kSLBSYimKZd3d3f9Xr179v7m5+f/8+fMxgrUljQ3FQlIthVtmYGDw//Dhw/9hQEdHByNIQdjNDDVYSbEUbJmKisr/yZMn/79+/TrcMpDv0C0CYVjWQLeMmKyCEowODg7/b9++/d/CwuJ/fn7+fwUFBZRgRE6dpFiC1TKQ4f7+/hi+Qc535FiC1TIWFhYMi9CDjRxLsFqGjNGDjRJL8FqGXlxRaglOy2DBBkrKt+z4qGIJDMMtgwXb61mE8wu5GGwZKNg2FHPRzBIYZgA3C0x5MSRogQGUDNhNcXw15wAAAABJRU5ErkJggg==",
    tm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACZklEQVR4XrWV7U9SYRjGz9/SluCcphUR74K8iLyFkQwOuZYCJShqNJ2yFdkot9LEYlZQ0WrGzIiXcrpeWC9fCCmLKVYf+xv6esU5bjh2vtCAD78959nu3ffu676e+xAPPD1IHhXga08fiv02fFNKkTwsxMvBbrBfOOoKseAw4P2IB9tzTny84cOj1FVk3RI8NuvLQZzUKH22xM8xEvwPdLF3VgFWX/nxKTSJfOA08jMzeGrRloN46XEIX3uhe3MZhxIuRpJqIcIjWqS4JRllXdix9WHLQCJ5RID42T0Zles+dK5N0N9UwdkfK4wk1UKEPVo6eUShRHGMh5BaRc8sPrA/M6oIdU5vRjGZe8hIUi3EvN2I80Yp7gxI8NMlQIgUwN1bOTNz5jrdUWArVqOMpc4iKiWWXQZs2Dvg71eW7rLGuJGaWV7ahakDLCzI+LjAYiErViBpVzGCa4UIOg3w8TjQtTfh9kUr1Fw2hjitWCb33Vgv9ooJOTDxmpEZJqFpa4Jb3FZh/XpBRDwaWkYvmw2PTQZ780F8kSrK1q8ntEHS3SUXurtwbZSP4LgcK3pxhfXrBS1j0KuHe1oFXkAL57wFnikznph1jOBaKW+QsOI47g8JEDMdw7qch6SjAW6ktv6qWY3dz3eR27iFtUUjFkl9Y2SkNkg+MYffb6P4dSmAfNSPbOJKxQapF8TNQSPujZnwPVb6l6Vn8ffPB2SWhvH8jJoRXCt0Z9snxVhq4WCitR2RDj4KJyR4RmoYwbVCd1YwSrAplCPLVSDHl6PQ24noqQbJSBUoWkTYsYqwS4roR96IYv8AgF/HKi6vbjoAAAAASUVORK5CYII=",
    tn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABLUlEQVR4XmN4ziD8n16YAV2AlnjUMqpgoi17KaD0/+vk2f9/X772HwT+3L73/9vsRWBxdLW4MFGWvVIw/P/n8VO4JT927P3/9/lLCB8o/lrHBkMPNkyUZT/3HwEb/DGj+P8LHrn/X2csgFsOAr/OX/7/nEUcQx86JmjZGxNnsIEgC0D87yvWQfhT5oDpv+8/gOm3zoEYetExQcs+ZpeBDXvnEwn21Z8nz/5/W7L6/wsOKXDwwYLzU3Ethl50TJJloMTw//v3/z82bAMH2xsD+///vv+gnmUYwbhmE4QPDMa/r9/AfUaVYARheALJKQfz3wfEghMFDPw6fpo6CQSEwUn//kOwwSAaI+lrWGDowYaJsgyEQYnjS/cUeKYG0aBMTvVMTS08ahlVMF0tAwCdWaICxoaNMAAAAABJRU5ErkJggg==",
    to: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAnklEQVR4XmP48fjx7/9EgBfz5/8/yMBACb7PgG7ZiwUL/l90cPj/8/lzZGHaWPagoQEs+f3+fWRh6lr2fM6c/zcSEv6fMTAAS14NCQHzv16/Tn3LQAZjUfD//f791LcMBugSjDBAV8t+v38Ptujfb9QcQRXLbkRHv7wRH/+fEL5gY4OumVR8nwFEYJGgBR61jCp41DKq4FHLqILpaxkAF69NKfxN+VcAAAAASUVORK5CYII=",
    tr: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABaklEQVR4XmP4Imlw/7OkwX9aY5A9DKOWUYoHp2VfVKz+/yhq+P9r3nIwBrG/qNtiqMOHibLsm3/i/7+Pnv4Hgb8Xrv7/2TH1/4/ixv8/e2b8/xaahqEeFyZo2Rcj9///Pn4CW/Rzwuz/n2WM/3+WMIDjLwZu/7+aeWHow4YJWvZrxUawRX+OnkaxBBl/BToIpPZ7ejmGfpIsgwXfj6oODEtQfAiMU5DaXwtX///R2IthDlGW/f/xE2zZ99g8DAvgPrP0/f97+z6wun9fvoItRjeHKMtACQIcX8BEgW4JOv57+/7/H2Ut/78nFGCYQ5RlP2q7IC5++/7/Fy0HDAtA+JtbJFjtV9sADP0kWfZZ1vj/n5PnwBb+vXLj/1fncBSLvmdW/v8sb4qpDwsmbBkIK5j9/zVt4f//v/9ALL336P+fY2f+/5y2AGf8YMPEWQbDQEu/uoT//+oRBWZjyBPApFlGIR61jCoYZA8AG5/v0aXkubgAAAAASUVORK5CYII=",
    tt: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABL0lEQVR4XrXWMY6CQBSA4VdQcgALj8IRKCk5BAU38AIUHoGS0hvQWlhY2Olmt92NIdGYbPF2frO4EZllHLD4TYjMfGEkL8pxsfis61rDMFQRuRXHsV72e32fzfRgrsf2MZ9/Cx9fWaZ9YJIket5uJwFvGBeAVVVpEAQvAe8weiX4gFFTFFbwtF7rmznq7kYu9WJkA9M01Yv5bX1AK0aAhUnkD6PMHLUP+C9GzXI5GTiIHcwxnsxx2sDzanW952FdT8MYDYB85wK6YfQL5nnuDbpjZDbj2Nhc5B7kqYfA5zATLwQvhg3khequaXsao0HQ1F1DXhi1IFNFxA30xgiQ8eUKjsKIwcyA7gPLsrwO9vbe0RjZQOYq87UFJ8EIsNlsNIoiKzgZRoDH3c4K8vfjB2kKB+VJ/LRGAAAAAElFTkSuQmCC",
    tv: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAC1klEQVR4Xq2UXUiTURjHX1FoF0G7kOgiZNACLzIKMkyERl12IREh1EVCpvMjt8rIyHLhypmZplRSLbecXznSHLalU0vNhbiWM0MlUVeoUbRCvfBj++c5tum740KXFz+e9zzPe57/c57zwfWdlbuc9fXQ660Qi7PAcYmU+HgNBiUS9HAcxhUKiESXqT8kRIqUuLvoS0iBIy0NETkvZ7mybqyJvZG57jvJxRg6dhyT6jKUqTtoYl8xUohHZEwqRZOuFRLJbXCxpWxSfyTKql0ksVLZiNGKWowrlZie/A6LZZgn5jB34mtmJqYHhqDRdNFiCFsSKtik/rAfiHbbRSKsxnuBgIrZhEIm5iEiXcMm9YctLMxNEgbK7tTHbNIVHDGVLI8VeaYFhcIAlcoEp3MGcxMT+FldjdmpGV4b5+ddWHA6aay3awBkDiE0tYYR8BDbVIipX1txqk255NuxM8stl9dgfNCBLxkZ+JAkQ/qZJ5BKdTyxqCgViorM+NH7CQ65HMbkazgYo2IOSIjW4rXhej0V3PX8b0FW2/AcSfYxWYasdC2EQvk/jz6JkxVNWvvogRGfq+IJbC5/g0f2OCriu1Ju002TK7igFUF5LeBym70E3WpBcEEbSIxYTmXmxck4KH9x3r1OmuhB7wlcspzHnrpKWMb2L7duJVxJO+tcJ6JnBhg/H8KVdzIInnZCXFvH/EPZCDHC9ppGxsf4N0psNQ43ltKWevcvULFtVSbaMmJ9Y2TfPLa8/yiiGrRLsUDFyGUld2jfCx3jH/kmRnZ3Ku+U0nigYjEGNQpt8YxYaGUzcnsS+S+Hh0DFSLWkjcQSyEqS2q8y//Hgcoy/uZxXWCuiYh21MeoiGOwShD/UQnS/Eh2Dkch/fRKCGw3grptYso0z3KJiP1PBKpCXgVzcjtFo+gzFmfPot6ddxOc7x4eRNYsRLry9iHzrae/Y393yw/rE/pORP9sKGOgkRTwZAAAAAElFTkSuQmCC",
    tw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA0klEQVR4XmO4pylwH4j/0wHfZwARWCRQ8BNv3v8vU7gxxEnEmJbd1+f//zyCB0XhEw/e/6+LuP7f18YwgBSMadmLRO7/n+eyoSsEY5APX8SR7UOEZY8c+P5/38Dy/+9lxv//7jD8/3WUCSPoQJa9zudCN4RYjOqzh1Z8///fYwDjN6Wc6IopxaiWgYIIFISg+Pk0hR1d8f/Hbrz/31Zzkht3mD7DxoZhClMlZgLBhsGWpJNtCQwTbxkoYZAZfDBMnGVUwqOWUQWPWkYVPGoZVfB9AFGxbLBnvwHDAAAAAElFTkSuQmCC",
    tz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABFklEQVR4Xq2TSwrCMBRF43cdnQiCKOK2sgrBgSDi2A24hxbsZxEiaouLSNtpfE1R0ySNSergTMTc886gCB0R/SfYR5QUiEYRop4HvyEexQMXvBMILiAiIMRIkLxRPLQFB7oaHsVjU1jN9VcNj2LEBPOamvoYxZAOVnMDUW5WUx0SxT1KyrGdDJ/ta0jep1G2giOfZjJWc7esgYNIOaI4OcAGrRGHRXBYPXKoSZd1zVukk7Gah2NNvG9KdDIcu9T04LiFXNMmYzWpY024k8dFPjWJY819rq/hYTWZQ00xhE9hKw/qYDWxZc1tZl7DY10TbOQRU8RhEVZDoOY6dasxkX1rBt1qeERJo+Yy6V7D01rjr+U/d+QF+gfr0VXuL7kAAAAASUVORK5CYII=",
    ua: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAPElEQVR4XmOQyVz+myF6939aY7A9o5ZRikctowoetYwqGGzP/6sM94H4Px3w/VHLqIFHLaMKHrWMKvg+AD6DK+Rci6d6AAAAAElFTkSuQmCC",
    ug: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABN0lEQVR4XmNgYGD4T0eMIUBLjCFAO9xcznCYXpjh/3OG//TC9LXsx3HGw6Tgl7sZj11axX92ZTvj5c+HGY+gy+PDDPcsOf4Tg29bcPzfF2H1f1dv4/81M0v+Xz1y8P+BRDcMdfgw0ZatcFb7/+3T5/8bV6/6X1tb+///XyD6+OH/VXthDLW4MNGWne0oAVuweMni/8Xlxf/XrVv3//fP3/8vViZgqMWFGTDyAg4cFRkFtuz40eP/vX29/9cnR/1//vT5/+KiYgy1eDCGAFbMzc39/+b1m/8vnr/4f0L/hP/bli35//jR4/9aWloYavFgDAGc2MbG5v/iRYv/V1dW/589a/Z/WxtbDDV4MXouJ4STIxnOl+bwnK3IZTiOLkcI0zdTowvQEjO8n8RymF6Y6HxGDTx8LQMAQQ0+yPjOw2YAAAAASUVORK5CYII=",
    um: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB90lEQVR4Xt1VS0tCURA+f6NFEBS0MCoqRCkRy15oD5AiiVv2sIcRtxeGPexFDyIIIpBAgpZtgtoVWUELoU1BiwgMiaDatLJEaHHqGzhQZxHX4LbowsfMfDN35szM0csKS1rfba4AzyhQeFGVyg1WH+n25kmSsMFDR1xmkYfnmL3cWDvMZ031PGKxawbLK/W+NXgWeG5ZLyUAUMDdv0pScPCLOPAovDazefN8cnaqFay4Sn3HST3qOs8xeSlZU8/KNwme/J9xrq4lKgZ99+Ccp/OwfKMnNTIb5lnGTu5U5niNO0i6f2GbJGzw0BGHwpZGPx1krrbtJepWHrSCGUydb0g0EAjxbHM3ddI9ukE7goQNHn7EYbzYIXa3PDh/exfePtcKGqM6tUUvowucGoV6/ZskYYOHX8Rhhxhn2mM0FCspkQgnRyfQUQgSNnhRCN2anWPkT3+MxvYk9oOXcdtEZ4KDDf4rh2LY2WLr0P11IHipFTRGJJhY2qEbhpv2tTNx8+AXexS/u7THWGDuSIr9oAN70ySNC11AwhadIQ4civ2qM0dFz1N1pS9hs3oT9vI+AvQ6h/oqc3JcqGMsJif8Ceyzu7jcrl4PuxqfPpJPoBdYtEW5kK+oXvjbMcZC4X35b0Uv/OMxPh4e78kfOb3AIpaKuPz51gsfEq6uXSUC0xkAAAAASUVORK5CYII=",
    un: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABi0lEQVR4Xu2S3SvDURjH9/+5V0otEiWKC5GLIUXixnLjbbM0ZpGM5ELe37nAhbxs++197K21FjL5Ot8jLg4Xv18budjFt9M5z/d5Puc55zFVWL1ahfUOvy+vZirDitd/hFWN+1E56kPtVADVE360z4fRMB2Ue54zruZ8lw5YiyuEkY0EGp1B1DkCaJ4NocauoU0AN69zcs84fWquYZj7LIOOhQjMNu0LyO7Ymfs0g/7VODoXI9Kn5hqCsfChLy87IaBnOYatmxwcBylcxZ/gucjKS5gnNemjX62hG8anch6lJah1LgyXuP3KZRb2/RQKr28SShjj9NGv1tAN438si9t3e2K4fXjGefhRPiW7S+QK6PJEJezTx1WtoRtGscjEbhJNMyG58q9cJ2m8iM7Gdj4Gx7aXlD411zCMU3as5TG0di9HnTA+W58YDK4Da3EZL8k0UpzG0e0khtcfYFmKYlCALeJpuec542rOd+mEURzv3pWYKJ5AveiOK/c8V70/ywCseJVhJdEfw94B3TfjP1C/ehQAAAAASUVORK5CYII=",
    us: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB7ElEQVR4XmMwMIn+7Rhc+V9SP/a/kVv+f237LDDbJawaTIP4IHEQG6RO1ijhv4pl6n8zz8L/DRZ+//fauhCNGXSsU7/6JzT/V7dJBxsAwiALIjO7wDRMDCQPUwcSB1ncUz/l+ot9B/YTixmM3fJ/g1yakN8PdjHIsNC0DhQaWT44uQ1sGYi9ctPh/6QABj2zhB9FDXP+K5gl/feJbfzvEVkHZpc1zwPTID5IHMQGqQNZYhtQBnZIo2fc2+ORsY+JxQzaFklfQQZlV06H+yyleBI4jkA0zGcgeZA6UPCC4hAUd+25TTfvzpl3mFgMDsb8mplgzSBfgFwNsii9bAqYBvFB4iB5mDpQHIKCk+Rg1DaO/QEzCORykE9AbJBFIBrEB4nDLAL51tKnBCxPejCaxX8DxQ9IMyi1wXwGEwPxQeLIYiDLQHHWGl3w8HJl3XliMTgYQQZUtS0Exw0opSH7DJbyQPKweITlO5KDUd8y8RssfkA+cAmtBgcXyBcgGsSH+QykDiQGsowsn3k7pz13d8367Gif+tnFKQOMQWxf7/wv6GLo6qYnltxBNxAfZgD67j66d2kFGC6U1+5CdwGtMMPxiNhT6EmUVpi+wXhn+pyN6MUKrfAwDsZnO/esQ6/kaIUZ9to630evvmmFAUOxrmQB62SbAAAAAElFTkSuQmCC",
    uy: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABsklEQVR4Xr1VS0sCYRSdn5C1iYhwXwRtolUEbYKgx0ZaZIsWQS4iiHDRkyAISjKpsLKHZCQ2phSGPdDAygeNUfhAMqdWYRRRBkGzODEfNNXkanI8cIaPYYbDuefe+1EAWOQHLMU/fr5hzkNgUwlkMhlyziG+xeLxOLiPN9gt/VjQd8FFjyOZCBLhL/ROh1Gn8Uhii9b3JohxHIfNJQ1iXjXs81Xw28oR9mjx/BAXxPifqBqrJJY27XBELBqNgrYM4sTRDMNAMZyGQgx3KxDcrgW93A4mdEzE1lwsRk0RSZwwx56IGF8q02wf6LlK2PUK3OwXIbChgHGkBIs6FdjrgODuH/jO7My7Ch/dAM9KGRwzBbBOKbBnrodrXYXMS5p87Q7cE3dSaHHfpokYwzDwnxwidDQGxt0By6QSW4YKmHSNiFyeCl2Zk8yIx1QSz4938Dh7YNSp8Zr2wmHT4YLxESEebUNnULbuSmJ158F79jlLXgnnHOLvUMsIluLtiS3LQVJGElyWQHNNosO3pLhN5aDQ+uLiygSW4teIeLXIQbKu8poZv/rF14Ec/HXF5AH5HepPpE2SKnXfgN4AAAAASUVORK5CYII=",
    uz: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABMklEQVR4XmNgmLn1PhD/R8YiC3f/Z5m1DUUMhDnmbv/PMhtTnEh8nwFMQAVABs249ui/9cZjYD7//J1wxWor9v8P3nX2v//OM/91Vh/8n7j/0n+ZxXvQDcSHUS0L33Puf8nx6+iKwD4C0TzzdoAxiE2GD1Etqz9z638A0OXIiuSW7P2fcvDif12gb+L3X/zvv+P0f7N1R/9H7jn/X2nZfnQD8WFUy2SABm999BKuQAAajDCfgfggn4F8BfMhCRjVMhCWAMZDysFL/3VWHfqfdfQyMLHs+h+48+x/g7WH/vvsOPPfaetJcJyB4k5i0W50A/Hh+wyr8uuvbc5veEJrDLKH4dfT57//0wGA7Bm1jGIwzC3bVJpybWdp+hNaY5A9DHJbre4D8X864PujllEDD2PLANts1/O1XhTKAAAAAElFTkSuQmCC",
    va: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABpklEQVR4Xu3SvUtbYRTH8fwDBRf/A12FLp1EUJfSShfJIL6huw0litXBGE3Q5IovMRaDqYlp1aEGAxrUK5JBC6X4Eo1IhItXr9lcRLFJCMm3iYNcshTJM3TwB2c5h+d8eOAYuDSo+eJZdWOM8Pyohhfsv8IURWFry1fc1kcMVoAkaYjlpQkCAZ9+pI8YzGaz8Mn0loH+d9is7fqRPqVhc7NWctlbXK4RWpvrsFo+8Lm3A7/fz8y0Be+cJAbLZrOEw2usBt3s7/9muPM97pZ6JqVB5r/O0NpUydhooxhMVVXi8TjX2jnHR5scHawTXl+i22xE3nDR3lJFn/k1ictw6Vgul0PTNFKp1OMmyW6juuIV0mgbDocdzxczXk/P07dKwgqvM5kMsdghwZV5Vr7V8qa8DFmW8Xo9pNNpPVRIaVhf/hiWA23YhxqIBKcImUzsbn9Hu1JIJBLc312IwyadNY9bFtxdOK1mrhYXOdneJBIKkUwmiUaj4rBfP33sBI14uj+i7O1x6nTyEJf54XDkj+eE9J+YOKw4Z+PjxS19xGL/yAsmBvsL8HbS8aqvlYMAAAAASUVORK5CYII=",
    vc: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA6ElEQVR4XmOQzpz+myFi1X90PHOH/f8vHxlIxosuMPyXnIWJjZYw/GYYtYxYPPQsu/GM4f/jV6gG33kBwVS3LGA9w//8vagGJ25j+J+yg8qWwQyQncPw//h9iNjaqwiDDt6homVuaxCaSvcjfAoTy9hJRcu234RoUJgLibtzjyC+AYmBfHvpMRUtA+E4YPx0HWf4f/gew3/leZCEAfJRw2EqxxkIgwx/9Zbhv/1KiGZQwrgPFaO6ZSC84RqqAehZgaqWfXiP8Bl6NqC6ZSAMShhq87H7iuqWgfDph5hiNLMMHx61jOaWAQDzvOudJFQ8wAAAAABJRU5ErkJggg==",
    ve: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA/ElEQVR4XmN4vJ3v3/8zDP9pjUH2MIxaRike5pZNqzf5O79X/z+tMcgeBnGlkt8MKrX/icEs6vX/e+cd/S9g0Aqkj4H56GpwYbA9xFgmYNT6/+rtV/959Jr/Hzn9ECx2+MwjMB8kDpJH14OOibLMJW7Bf13vKf9d4xf859BqRJED8UHiuj5T/jsDaXS9yJgoyxatP/+/omsXhjgyLuve9X/BuvMY4siYoGWrtlz+bxEyC0McG7YInvV/1bYrGOIwTNCyguYt/w19p2GIY8OGftP+5zZtxRCHYbA9bZIeL5ukvP7TGoPsYTgvrH3/vIj2f5pjoD2jllGOh7VlAE0lobs+tX7aAAAAAElFTkSuQmCC",
    vg: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADXUlEQVR4Xq2VbUxTZxiGT2Ky+AMVGMWiDX7AdExgfBTc1jFJJLjGMrEOikVBQlsLVAFRKIWuzZxjCirgR9hHV5zihGAlRBxhi4kOMVuc/CBZzDbdln2RYfZ3P4xe63kNrtolMOmPOznnzfPe13nu93lzpInG/Q/unr+A13uN+PhmJMkidPXoaW5IEj2t/Y/W1MkuvrDY+dVuZ8Rz6dH6rBUeXnPv8M527tibCIQGwgIhv4yNU13dy/z5VcFmM+mYs+e+bNjXPsDNox8x1X+ev2/fYfKTHgGb+vwyf3Z1MTU0zNcDX3LuiE98gMvmCTabSTdVscL0/+qrlMxgs5k09s6JB7fajiPrh/aT/Hayi9/dbhGZbPpHaytT3m5+cjTzXWunqJM12NgZbDajJMu9lJT9XOi/wd3ubm5V7MZtPMhox8Mzk+N1uQaZvHqdn/fUMWBqZlWc4z+MZqFuz+j9QMj0wT85jf5Begz6QZGDqKg9bGtworNWYWhwCAU+yypxuEWdgOVn2P8qzKwPmq5XkpooT6kgafXjXcjQ7Ow2XlvTwPLljSjykvzv4SSYVEhlCZQVpqLIXcKr2sVklCuJK0kTdQ/3S5Yfg9qdpWQTlSGd9ZsWodAvFbDK3aWk5qWyIltB1vYIVBZN6GCLC1IxFIbxkjWGF3esw+fzUXuoFs1mBUXWhaiM6aGDLXsjkZzchSLGktoChoaGOHC4nsx1EaQVR6Papg4dTI4p0d+F1phAjnMrXo+H7XuLWZWrQG14NrQxxhRnEJ+vZKd1ASannpHhYcre3SVi1BnDRIxK5d7QwNS6F9BsieB5oxJzh53x8XGcx1rQvhlNjjlKxPjvnjnA5GuQZc4lY+Mi5m1cxpb3KpmYmODiyCViNZG8vDWS9Lr8gD1zgGnW7uLtt+ooLw8j0bQUfX0RhzpacLU0kWOIpsw/jWuzStmwvnpusOQ1Vr7/LI7Jy9Gc6z2A2qZjQd4KcdfCN68kqVJPha2Kb/qW8O3gStRp1qeHrX7ORlvTJq5/msy1j+dxe7SUM3315De+ztmzNYz5CrjY+QxjvWo63Xp//b6nh01LqTThbbdw5ZQKX5vElQ/9v59Tkr+jWN4/uIMYpTmgfo6waUVGmtFu2EeNxYZOWyfen6z5B6kbvWLuFhpgAAAAAElFTkSuQmCC",
    vi: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADlUlEQVR4Xt2U7U9TVxyATfYf7C37uJfMD6DRYbcok5nhIC5jiyS6MVSWyBAXMBOyD5si4EDD+5S30s5CGfKOwKAt9kXBFgtU2lJmpRtIIYw1km0syxaiRJ5xb2lrq26LybZkT3LuvTnnd37Pvb97zlkHuPl3cK8TLqG9/xD/kWzc3MDl1jSc5lpW7vwUHHYP9itSrp7fyfzkQOhQgLu3mbmhYeJKHhPG077egOzO0iKW1rfol29GdXYjfdVbsely+P3Hb3zBuN1uRgfOMajchkub7O8XWLm9gOdGA4MNb3BJtoVZzVbGO7ZjH+72hQSXccxqRFUVSV/lJi6UbGC4PkK8G7+KYWlpSYxxaD/ht6tRDDXu5OeFWe88/UlszRLmtdvoWI3XSzdx+UsJQ/oalpeXfekf8M9WS3CtN52aYy/SWboRZ8fLovT4iUIiX08iMuptng1/nyeeS+TJ5w/wTkI2lguJokgvfYnusg10VcZiH9EEpcUnGx1zMGB1ij3918YZsTnQteciPxFOc8FmzMoIstJe4+n1qfe1qOhEcVwnldBSEIauMZXpKW8uAcOQDSG/XzY3/wM7inrEwdhSFRa7lYoWKW1dTaiqd9D5xRZyM3aRmZxN6t4MDu5O97cj7x6gryoCVXkEBnUdy3dXMDm+9cvizqjx3FoIyISnfVVqDLYJEipVDDtG2HtyP/2WAW7NDHFRuY/SnPcwlijQHj0d1OpS0mk5E4dzWMGptn6SpBp6LS6mbk6Lsj1y/6oNyEyzv/JC8ikM07/g8Xj4TJbNh8VpzMzOiJFWfRHaksogUXdqFpqCVNzTU8zNzRGd10Ty2TZRsLi4+HCZwFNpcrEMwgpS6OrZ/mkszYY2piftjLdH0iVLoDfTK+pMOY7s8GFxAU2NKsX5KTIVn59Xo7YE/plQxrWvDMiENxP2kXAX+O77SXZlxxN/LIGe+o9Q1cRwsT2f8pw45EcyqTi0h9bqD9DUJtF3bjcVdU3El7SjNo74Rb68azkfsPTXEEpZJitGXyPBaSqmt+drRjviaS0MoygzHFnWesz1EnTqJm5e13I0I5qSsqzQNPfycJkPhaIQubFOfHZcyvfuJ9krtBeF0Vj6prgvY/IbefxgMY4xW/DkYP5aJmC97k3icrkwq1ZPi9ZXaavaz8iQibxmHY/lmnjm49qQWffx92ShDPb7zzuRxAIl5Xpx4/4ZjyZ7RP7Hsj8ABxdV6oAEy8YAAAAASUVORK5CYII=",
    vn: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA/0lEQVR4XmN4wyD6n16YAV2AlnjwW/aWQwRDjBhMlmXf2rkwxIjBpFvGIvr/32um/x9sBDDlCGCSLfvozP///3+G/9+aSfcdyZZ97+cEW/bnNvP/dwpCKJhQXBK07HM03/9/nxnBFuDD37q5wEGMrp8ky0D4vY7g/z+XWTAsAGGQQz7582HowYaJsgyE3/KI/P+1nxXVoveM/9+rCGGoxYWJtgyEf5/G9N07GWEMdbgw0ZaBDAX75jvj/6/V3OAEAuJ/yebBUIsLE23Z52ResAUfDATBfFCw/ljO/v/XbjYMtbgw8ZYBUyXIAgxxoCMIJXkYJtoyauBRy6iC6WoZAIhBYaW2x7qNAAAAAElFTkSuQmCC",
    vu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABz0lEQVR4XrWVv0uCQRjHv5WUEIGUQ0FTQ5k0KAQSor0gYYORRZuULRElJOLgKCQNrS1NNWQg5dAf4GBQFGm6JCgIFQ06uEhLJMjTe74o73s19PrjhQ+8793z3If37rk7uPW4fQCKWYB6DQoFfAcOUD8ewL3Y8MUHdBPY7Sil06DHR5BrFqUk8MIHdQuIz5tGA/L7QZUKKBIBBQfxlAGqfHCnNGSQXmhyEhSLgfJ50NoCPm+ADJ/QCQpZE6cTVCyCTk9BWyPIpYAyn9gOf8oYWq00pUy66UbtHEjxyWpRyNjamUxKqcEASiRA8ThofRwf4jZ55wf5Ly2ZwwHa2wOJ1dkoFiaRSz0eaS19O6gfAc93QEUtLRkT6HRSgbDvUOj31LJ+to7JJMjrVU9LFgxKg7lcIEEAhcM9lOn14hT5QNGo9JdsG8hFzWnc3e+vG/3GrO3CVlFLS9aEl8gLxLg8+mGL2t6Fa4Ha4Zesibz0NzyamvnQnOKT1fKnTL6pp1cncouxxTKf2A4Kmfy4ElaGPi0nlgyf0AkNGX8Qz25PPQlXQpUP7hTFFTPvHC5Zz6wvfFC3aFye/kBffS5gvBcbvviAboKZpbFb+6X9le/oBT9gLs8SNBZHNgAAAABJRU5ErkJggg==",
    wf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    ws: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAlUlEQVR4XmOQYYj/zcCQ/R8dy8hUY4jB8H4G6f9ABqn4PgM2y1hYcv/39+8D0xwcBShyVLWsvHzDfx6eIjAbRNfXb4XLUd0yDY0mONvGpg/OpollMKyi0gAORnRxqlsmIFDyf/Pmy9S3rIPB+G0Dg+l/UvB9Bl50g4jB9xlABBYJWuBRy6iCRy2jCh61jCp41DKq4PsA/C8GWxtlC8UAAAAASUVORK5CYII=",
    xk: "iVBORw0KGgoAAAANSUhEUgAAABQAAAAPCAYAAADkmO9VAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAGYktHRAD/AP8A/6C9p5MAAAH+SURBVDhPrZQ9aBRBFMd/u3PJfRvwQA5s/AjeiU1E1E4wUUx1NkJAsDAWapEqrUVEJIQUVmIEbQQh2NgEjYUgnKiNFywCMRIIiiaixSWa/bjdmXX2spKc2ZwW/uAxy+P//vvezs4YovIg4D9iRmssUgXIho/0JNLVq1TNCIKgGXFsMQyF0vaQjk9CGAyc3E9Pd4ErlYPsLeYp7sygfIWyvFjTFsNQEIpHLh6h7+hunl0/xfznVWxPsPjVwtbdvhzrpyufZGr0DMqVW0xbDA3DAG3o67Gev/lE3/ATZubqCLfG9Ksllr816D4/yUrdZuLpvK421ms2Ebsp0vEwk4nms6rv4vvoOWpLe6g8HMbxkpimj/IUolM0NZuJ3RSR6kBJHasFDpffUuha43RplheDN8FNowIRaxYSayj9BP2lGSYv3aA2dA3L6mDNTnJ83wLjZ++BE5q2jvqb+JHVuji4fQFruZOAjeJs1uX9lyLlsTuI7I8ou0H8yKZ+h51jYrqXTK4RZUNbndeTDjwagk4nyrcSa9gk/ZOrjy9z//UJsilXd9Ygs6PB3Wov7xbLmAkvErbS9uiF3zKlO7FHBjlwa5xifoXq7DHMXF3/LpHoD7bvUGMIH6eRYmquhw8fS1QXDiHy25uF/PVy0MeZwMkg0laUaU/bDkP0YfhnM4BfSqPRkVzFO4oAAAAASUVORK5CYII=",
    xs: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAzklEQVR4XmNwWPb/P70wA7oALfGoZVTBg9+yCacxxYjBJFuWuPX//2+///93W4kpRwiTbNnSq//BoPEIphwhTNCylO3//2+58///9rsQ/OEHxLKHHxFi627+/x+6AVMvOiZoGQhn7YIYjg2cf/n/f8RGTD3YMFGWgTAojq6+RrVo131Mdfgw0ZY5L0cE4eefEPrGW0x1+DDRllUcgKRCULIHWTz/0v//f/79/x+9GVMtLky0ZS3HMOMGlA2qD2GqxYWJtowaeNQyqmC6WgYAm806p6cnCwAAAAAASUVORK5CYII=",
    xy: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAA7klEQVR4XmNgoCf4T0fA8PPcxf/0wgyPucT/0wszvMsp+U8vjDfOfl29/v/LgqVgDGJTCrBa9u/zl//v0vLAXn9hYv//Q0XD/48dff8/9U0By5ELsFoGs+hdZuH//79/o8j9PHoChU8KwLAMFFwgi55rmvz/9/0HujQY/Hn89P/7ykawQ37fvY8ujRNgWAaKH5BlbxOz0KXg4PPM+f+fiCv/f8Iv9f/r4uXo0jgBeZbNmv//KdCyxwLSQMtWoEvjBBiWER+MDZQHIwjQLYGAAF2TPgxQPVOjFym0xPQtiNGrAVpivHFGbYBecdMUAAD2YJSuzs71rgAAAABJRU5ErkJggg==",
    ye: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAZUlEQVR4XmP4rCTz+yMbw39aY5A9DKOWUYqHuWU/uzve/mhu+E9rDLKH4f////f/0wfcH7WMGmA4W9bR0fG2oaHhP60xyB4GGRlgZmNg+E9rDLZn1DJKMf0tExMT+4IuQQsMsgcAYl/9IudIOL0AAAAASUVORK5CYII=",
    yt: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAAV0lEQVR4Xu2NoQ3AIBQF/xgV6OqGAbCMxQSdtqlCUH95AVTVu+TsXaRy9zjbmLnDc1xT31x7eLaCceoZuxLGqWfsShinnrErYZx6xq6EceoZuxLG6e+zD1SnjhiebqbsAAAAAElFTkSuQmCC",
    za: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB6klEQVR4Xr2WTSgEYRjHn60tXGhLlJSP9rAOllLK3dHBgXLzUQ5ycl+HdXHbu0nkgEKs9uaj2Sxq14o12chOK4PUhi2jtcbMY95lind2mRkfb/1qLs/z7/f2Pu87ABMtSRXU8B3NBlFRROT5a3S5XhAAfwugwwgNC13n6ewDh7KcxbGxC7rIKlA57d6gwwh2plVi4sssImZUywTW1T3SxWYBjEJyZKU6aGNaRDqQ4F7q4d8tH9Hr5egGZoDhbgi8ROD6bKdIKJ9qOqDDNMuFxDqxlPDyMo719Xd0IyOAupKOUkjHF2FLtcSvLNv8/Sfic+Ykd4DGxyN0s+/IhcHbB6qWu3IEbuPbxedlk80cHaZZriTZN0tBCKPHEzLKpzBChQNuE37YlfZs0uByDasGZOhAQntgiHuSszyaWLow2jIWKuELWZqmUBht2bdUy6oFkq6BGYyGvW/p34T9yzbmscl7QNr8A8c/OiC9HRAmNmTAHZPNMTqA8HHAUynpwOO5ChklF0aG+nAOQkaHWlFQ9PluggBRNIXR62rmNLCp2TidnKBrZARyEY+uVm0VstEuYss2H6maalyjAzQb7YlJp2XOss0n8jyezvlO4T77cEiCGCbF2u37kr7QCnl+CxRURGLjdh/z+gLrvAIhPFmEvRwcxwAAAABJRU5ErkJggg==",
    zm: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABAUlEQVR4XmOQ7GL4Tyd8nwGLIElYtJzhvzIWcWQsUQJW95hiy1QTGf5PiGH4PyWD4X8skO1cwPA/LJXhv2U9w/+sbIb/KUAx91yG/7I5DM8ptkyiheG/USzD/wRXhv9zQxj+7wIaPi+c4X+jB8P/9XEM/x0iGf7LB1HJZzAs3cjwXzuF4X9AEsP/KqDFWUDsFgCUK4c4SJIacYaOpTIZ/geHMvw3zMOQo75lICxVjCkmSQ3LZrly/T+qywfGM6y4/jMLMsBxfATD/yt1EHyogeE7xZatseb5f09BAIxXG/H8Z2BggONkYMJ4XwvB1+sYfo9ahhOPWjZqGV48ahndLQMAOdeKkIrrwJ4AAAAASUVORK5CYII=",
    zw: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAB70lEQVR4Xr2WS0gbURSGj6DOIEKUUvEJo1AKbQWjiJvixlKtC7XQhcuu2lU3bkqhihsJEjXgG1TahqqlSEURLdYgdKpGRwwxaiJoghgYJWBAjC6i/s1cmEGIm5BJfvg2Z+69P+fMuQ8aHRvBo+oCPGnlYOzlEwr5fD7IsowXL2sgvE2LGqAnzExROByGyWTCQyMXKu/i/ZV9/LHeaGaqRFFElbEQrl8EbOtLlJmiU48b9a9qMfg5ekI8aGY+7wFcW19wE7qA3PqRxZSyPi9LPT/7neK8+ZfiiBfNzLX2BmtzhHNbO/Yrn+L2OsziSllLS4oxlZcJr5AVF5rZ7bUM6U8ONqY57DdnIySts7iiYDCIpsZGvDfwUQvEAnntq/C+rsOykIPgKo8TJ8G/Rdg18/A8y4X7cRFOzR0sU4vFggfpaZfvDLy9JZsXY4Vlpiy02fYBsoMQ2CUs/SQ4Fgl2K4fL7SktQ0WSJEEQBBBR7KhlPHR/g0ckTAwSxgcIs18JC+OEZZtVfzOn1I3hTsJQhO8Rs552gs2awf6XKl3KqOhofgz2SQ6ev7mRRsnHj/5MTH8ysG+6NYhqdrEisj12V1d7O1iZndG/9e9Twjb1XQUCgcQeV6qSchCrV0xhRXqovo/zN4xwx3qT3Mszmc+C/4K39Tk4+/u3AAAAAElFTkSuQmCC",
    _af: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADH0lEQVR4Xp2Ve0zNYRjHX5vLH/6xGTM2s6HViDW3RIQuCxsbZrRmY5aKChWnG6UpRSLCRtZUhkYZK8NKqE4XE11XipUluugiWa2v5/m9xzn165yc2s5355yd3/t8ntv3PSK/FRiq8m7AOeUspkZux+6HiShuB9I/NSNG+wZa+v1Mfg7edwKuaedQ8wuYfd4dImQDpkRshQjdBHHK2bTUsLIuIKmiBjNi9mBmzF6Io0sh/JdD+Fjh9NsXqOoBavuA1y39KGkD6IWmASClph4icKUhMCWgyBTsA4FKqBLhvZAe3KjL1Ek+GOYkg2nWYNu9OAjfRRAn7WB11RvzLx3E9OhdEEHr9SDra36wvOIlE9XYQwQ7GGBc0YUSLcRhCxlY3YJ/CnOkoPbyGf7MQSjg9bIyTI7YIhPk3zRr8fRzK6IK8+D26AbmxO2TsELqRe63Pgg/axlADfifQulMiANeNVOMI5aGRE6shghYoXTpK7VaX1n9H/oSuGr0qkYTtdQ98yZu07yV1gWtgzhug4nhrrhTXY/SDh1MS3PKaGiRLVQHMVecJEEiC3IxLWoHXFKjkFxViy/9tAcdsiB9Zbwch7JSDa3k3rN4PjwXdXBjYuAxG3hl34VLWjQCch7j3U/DAg7bRl5pv+fpCnBS+GZlq1xSo7HgsgdZYMnI4KbE4yAoF1AwJL5Rn1WSl+r6JLySjFveI30l/JeNDKwWWYMrfNbUrW+fSZgxFdOhB3VNhk1TA/Qge1gkeCpz4jPqOGbBWBVUnf/LDGqR7UgIK9QRE+idb5OCtpHnxwRjccaKd4xVp9vGim45p6J26d9xwZSDPwalf4wZn2G0RLFF+cqsU8hbmQ3fhwHNhvFNv/9JsrwRjIFoAxcn+ihVheRlQ3jMpSXpgnY8MA7Cq6z331AYVWt7S4PmQaC6F7BO9MWsWDfU/h4ew2wYi5dk+/2LytWkrsqTjMy24YRcydDxpcXKFTVuGA89q7FTd4c6StHnefEH0DhgeI6BahBrTDBWFZl8Z3qC9BzNzy4pGDW9w28KUxozjMVZf+yS/xTcWnNArL/cWuqCIh3XOwAAAABJRU5ErkJggg==",
    _al: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABl0lEQVR4Xu2TzatBQRjG/a1K5DPJRzYWRGwkFFEiyUJWNhR7kqwsKAsR5WNjQajnNk8d9565w924Vn41ndM857y/d+bMMeCNGOSJ/+Qjewl/ymazGSaTCc7nsxyR9XrNfLFYyNEvHsqGwyGsVissFgvMZjOMRiNqtdo932w28Pl8cDgcsNlsHIFAAPv9/kcVPUrZfD6nJBqNYrlcclXj8ZgFq9Uqrtcr7z0eD9LpNAaDARqNBlwuF9xut1zujlKWSCTYsczlcuFqY7EYV1WpVHR5r9eD0+lEt9vVzWsoZaJrUVBFq9WiSAyZ0+nEJnO5nBwRpUzrXoXf74fX6+XWydxuN8qy2awcEaUsFAopt7Fer1MWDAYRiUTkGNPplO81m005IkqZ2HvxsVOpFA+DoN1u8+OLLd7tdrwWCgXde+FwmAfrcDjo5jWUMkEymWSXdrudQxP1+33mq9UKJpOJJzKfz/MqRJ1OR6r0zUOZYDQaoVgsIpPJoFwuY7vd6vLj8YhSqYR4PM7nxC/zjKeyV/ORvYS3yr4AEhjsN+CPWOEAAAAASUVORK5CYII=",
    _an: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAABUklEQVR4Xu2POy/DURjG30/BJ2BskGgirmnKLhJGMbCiUuJWYiIR0a4dGrZGDNJBRAgGl380pC5xCwtpmrjXpSw/5/iT9CLVoUwdfjl5n/M+z3OOrF/DfyHJwl+SK8sKubKskCvLCrmyrJBStnkDwXswblOXf2PjB23r1szTp+gFPexF4fgFVsOvjBvrBC4inMXg4An21V3oEXYeEgN1QEjdHSnfqdoN3sHZq8p5Njl/g+WrKJPbBkuXj8ihWvYEDRpm3NimhpFuK+IsRTosFLhbsU+PUO+foCXgo33Bz1rknV1VfKJCV8Ixmue8FHrayBttRHorEEcR0mn59IvzK0vTVYKIo9gUe8uRvirEZUeG6tRZi/TXKK3SDFGG/LEmIsDg2jxWrxPpKTPRewM206t92v+dET8nDOlQhV2Ls1T7XObr4x+WKSlCOvQPdUmyniEfVqINAE32DfAAAAAASUVORK5CYII=",
    _as: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAC60lEQVR4XrWVXUiTYRTHX7oKuu6i7oRuEiqpJn1ZWFpUF0FReGE3EpUYqYhppi7EiFJoC8N0YVYzi5oIWs5S0zS/Z+H8mOJMza9SV+bHlib/znneNrZ3WEHz4ryM932e8+N/zv+cSZL6IFYkEnfDT3MGL4ZsaJoC6icByeuQLyI5GBuzovB6+DsaCNK4ojAOAkoX/RGQHQ3T15WGpewXpdSYmlE6OCnU+R6WGgIpYQek2M2oGp1DXocFrT5TlhpKCnZBuryHSieriSp/IozRNQcE5SUj8U0JTN/+F8YgUpJUU4bw4hwB1Fv60TMPtFHyboIdeXwDPXZfKGNY0l4cLriOjhkgoiQfIfp0DC0ClVTC1WlHoWlr9WEZSc3xZ1r0OYDigQmUDkwi+L4awQ/UeNTd5wL5BsbqYregYQIisXF4Gob+MdGvFjeQDOPG8gVlkn8NtjjNlHlGTthAFnduDGVIJ6gEUtxWuhTinejKPtETr/cpB347j1wY7Y/MlkbUjC+IbaEEeMC4mQLI6pxA/h2vQsDdWITqr9Hc7PQArVIfwtqbYQgrysYrWkkPqTdNNu/kypD4wc29WlchDyODYjbhlOEORpaAgQVgfeZpWYWavsVtQ/cskFZXiV673JfaLz/JffN/V8YPvlDYOygazUOZ9q4KVod84P00kPzWCJXukqyQyqrSxePjgvyd5+l8WQG0bhZfLgSMgy+vST9GyYIwuuR5iJ11u82EDdqzVN5ASJF+tO+mROk4DNZR5LZ3oHrc8Ud1LtgHUhBTUYR1GeEuVc5g5RpTqyjpSUMWAnUJ4rwzsfHTNO6Zu1D7eVG4UQnxgvFFtixv6UhjoSiPC2bjjTCPC+VPYaFV1Dkrv+cz5WSQdrK91tSC7bnx4rcS4gVzAllFs5uz+K+BS3bupV4407l+GPrcOiLGppHOMYTvu99VhgdsueCSZTTXw+9WBHTmTgES48KGIvdWj9mR026mnv1AflfvsmPwCw6OhT6BWQhWAAAAAElFTkSuQmCC",
    _eu: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAEJUlEQVR4Xq1Ve0yVZRx+07XKVpl/tGZttbVqUpKWVmTghRNJIy+z1k2Xl3VD5WIaSsIJAfHuSpAhsKGAME0lal5AZ0UHOcjhcrxwCyGGlVKSkmGT+fT83rcPjl8stfXHs/PufN/7e36X5/l9qvwX4P/CkV+Bo12A9wJw8iJQTzT1ACe6CZ6V/cJ/QQVJjv8OVJ0DChpbMac4GxNz4jEoLhg3O0OgIh/HjO2roaq6/nn5RlDHKo6SZM4XmVBR/lCLn4KKCTBYPhGKhCr+BajYQKgNleU6M3uQa0HutPwJJLkOQUU/AbX0ORM03sHzOPhvjsCwlFcNmVQnkHLLzlzGkQECDoTq38wcatiRMGnNkjGGQIJJNQsfxZetZ+FhMn6p8011FpmXw7sRorVuF/w2fUCSsVDLxplq/iaKLtkJcmB64TqoiBFsXRDUx+OJCeYde0ALMkt7EqIqFeFHkud1q/QcJIgQxjyLzdUercKEsgNQHz2D+9fNhCM3EaF5yYbUTiIQ6W7yVOqzL6EEGvHZu6zqaUSXfo5phWvNrOIcuImE4fu26+rbLvMeR/PgxrkIyIrBbYkvm1bbier/ADJrvVALHsG8ogztD9/nMi83f0emLUA1VThIKgt/CG/uTscPJGng/cms5O2iLUYcUpE1U99AzT0i4WysYBtCtiXoXpf9fAk1581zUaDMWPw0fM3rKO04j9QqNxrpsTYqc/f3p/nfBdyRNNWIxZqnhata9Ok7UHPvwVt70lHReYWXpkEtGoXChhZdofhpyaE9zHylbt+QFWFsnwN3p8yA+vBJgh5bTHXGTbqaxE4mvZ5Fkoy6OjRfAqbmJZnLFENg1lJsO9mEO5OnmxktCzRZa8M6+o3rFJ/ZqhmITFBLYXhIevDHi9jZ3A4ekVFbg7CCNTQut8PySf8e7FrwJeurkjNK/u4g7pLeR400frFftCCmvd4E7ESV58zmlp3Xycr8qTptyvgQ0zK954L6dt9jqeFmH0rV9uB2+BK5qbYdjW0ooCBKO7rhZR+HpbxiBi4SjiUi/RC8NQEbKl1a8nHf7MUxduKWT0INqe8utKOPiBV9xZ2m3n/AKEqra7TJeNFo3LvqNT1D2YkioI3ucmR5j0PNfxhv7EpDC/9Lp7gGO1/s95esNF9yX7LDFIbOzpqBXkMBSOMaEjNb74mXxmfHookEHb3Ae3tzMTRxCva3diI4x6kTDeLz4tYzuD0xrJ/QIhMVrueSlUz1TGT/MbNb2Z72XqPUY93mIylf4MM/9Wiz555oRH7DKW6bLdqLp2juIQkvYdauVJy+AswuytRe1XO3yGQHus72aj9JdjP5UmTJDrQx+1UV32Lh/gJMzl+J0PwUTNjqxH1csiXtXfiapPJeAyt3dZoFnsME8upb9NkjH9biLIxKj8Jfp43pTQGOqTIAAAAASUVORK5CYII=",
    _na: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAEN0lEQVR4XpVVa1CUZRR++9OPmn7kn6aZ+qHNOEM1GI6RZuhI4kxOd2dLM9NxnHK8ZNzUBNkBSQgMgWDDC6aImqwbQllxcUtW5LKwy0UgWkHIBcQSxSsozdM552VNvw2jH8+87+63e55znvOc86lTfwL/FzUDgPMSUE9wDwLNV4HT1zSa6F5/Gajj55f1cx+UMRCj+iIFJFSN3vk754Am4SBHOnqR29yKtLoamB2lMB3JQsjeOATv3ogF1kxY3C7k/9qJ9HonEk7ZEV95XOBH1nQF+L77IqwdPXBcGMEPv1+SDLdT4FLvIBIr7Vj4rQWvHkrFuxT4oYTXoGLnIMpehOTqCiyyWaAip0J99CTUmslQUdOg1r+gwZmzJJxx2w1gVck3mH8oBfGOMpgrfkKasxqZrjrUUlUzdq1HyblBLC3ajcjyQqwtOQyTNQNdw4B3BOi+DUnw5/NDooylsREPmOdBffoSFJ+O/ts42N5FsrSILO8VfoWdzacl64cT34DaNBsTkk3IrKuF9YwXC23ZWFdqxY7GJszdvwWPfPYWnYlQm0MRmBOOlJpKdAzrAlqvA0lVJxCWtwUqZjaUigzSpUY/T6UGQ22cqUum8xnLWkzdGYVJGSvwWOpiPPHFB5i4fTlUeCDUJ4GYRyRJJF37TarC7abEZhFC8MqBZNg6+kSNRmqLipkzSrZhhmSv4sJ0qT7w59hQ6Yc+R+8bpuP1w2ki1742D5mlB8e6B7Dyx4PY9MsxrKKzwHNOHMoe4PYUd/1BUoZQQdTYYOqFNNVIaETcXJErv70TrWTzs7eAFjq5FSriOQGTTkxfQWa6Ks98TvZQ9YrnwknNjCUziJxcgZHESBhNcodPkaBZDQ1Iqa0k2V/UybJS3BJSYVnxHpkvn9PF+lVE9hsxR5HDJiS/I9n7kRjBgVl+Cvr4tiU6yc0v0/19hOVvxeKiXQjaEYkvXS6R8g6ZDyzL22TlO1YdD0al1eSzpB0zc2Ngpb7xvJpPlokz/cjYqk9nr9F/Mga9H0S+6QjIWo1uSri897osAt/GuUdGH1z0g9TaKqiPA0QSv6BjgXq0qDAH3r/uXXFG+K2rNqrOfLJc98DX9LsDcxI8MzRPIjcZ4qmMD2HvuylbwxjvvmQMtvXXLe2yLVRE0D+ETETgxofmJcBky8IkcuQF6MVtjGPEv5Ix+HVhdpQgvMxGhFM0IW2btmvauZ4hbajVtB8raM54WxhjGDEmGaOBZqTi/DC2cR/XPStkPSN6QLNpvnjh5tEW+bzGgcKz/Wi4Mna//pOMwfK4yThLi3Olh48mmeitkCq9olzEdcd7b+BoZ5+sKhu960703/KLMy4yBjuMN82ZIX1nAwXlRIhr+TMTsuz8imGJeS+ys41xxkV2N1gmDtRF/Yq2F2Mrbf0CjxfLvtuDB+PnI4Dm9M2CdHlmJPwb9ZwnmcTIUVEAAAAASUVORK5CYII=",
    _nf: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAACcElEQVR4Xr2U7WtSURzH93flyHwa25x6p9eHdOr1CbFpsIKR9cK9iI25BsEa9GYU2yK1LZyw2psiGC1bEbEeFotIwy2NBrMMjba+XY9kenTuzhd94HDO+XJ+58O599zbgf9IBx18yWWRSqWQTqcFthQy25/pbZrSIFMppOjXaqHX6wU1lmVxQiTCPr1RExpkpUIepw0sOM4Bt9vdsjmdTmg0amylP9HbNKVBVuag+B1mEwt7C2FFxCCVydLlh9JURtj/CYvFCLudayJygNFosb3zla5qyeEywi8MWM11j9TFn4jRssju5unFR3KErILTNsCfxgWXywUdf3lye0V6iSAEyS4EvOAcDthtNv6kXDVff5pENBrFUiKBzE6upqI5gmTDfg+svIhzech849kalL09kMvlcDic0PYzkEqlODd8kaqsR7BMpVYjXzzAx3cbEHV24sZcpG7N1ttXMBl0MNucdXktgmRDXg7BkTEyZpk+XJ+ZJ+NILEr6lXtx0pcKu1DIZYjFlyuFFIJkPrsJyw9WsZdLQyKRkWzx1iyUyj4MnvHx35sGl0Yuk3w0FIT37Pna8iqCZMEhPx4nX+D1y+fo1pqquddbvjR26I3/svjtOTCsrTqvRZCszJvN98h82OQvgoLMFyI3yR/EbDGTz2Hi6jTJpybHwHkDtaVVBMv+ourpQmzpPhmPjodJf2Wy0gO/0dvdhZn5yrukObbs4UoC4lMSPFpN1uVF/gfu83BgdMa6vJZjy8osRmYhFp+E3mBCKBRCwD8ImUwKk8WKb4USvbxKW7IyxR8F3F24g4lwGFPXprH2ZJ1e0kDbsnb4A2bsd/UkcgjxAAAAAElFTkSuQmCC",
    _oc: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAADRElEQVR4Xq1VWUhUYRj9yaeeerJ6qKCgkoqMsrRosZ2gl4JIo8UiFAKTcWszbSHE0EKjMTKKNkjJrdByKSsb92WyXCcZTXPNXCfNrNP3/dcJvTPjVPhw5s7c+e8533e+5Yr0ph4siPZGUHYyPJJj8a4PqDIBTxs64RC2HbOjDuHjEFD0FSjoAoq7Ad0XIO8/IEp7iNjYCXF8ER7V1OPjd8ArNQ4i0AXi9Do4RuxFdnMv7lS8R3J9C64UvAE/875fCaBi9KomtgbBH9XfgN0JVyHOuCO+xoiclkEIv8UQx+Yhvq4RLjcCoMmIlwLZnwdIvB8OdDazuQ87HoYjs6kb9RRk4Wj2tsSlGIMPLyQ7Y8pKUDcItP4Csoi0miw99/oZ4iiz/C7l3qvWISnqmaSl7NdTYEswJXQrdB0jSDa2Iaooz6rgHzGzoCYzAb7pD+B2MxCPDZ+Q0zaEAvovt30YJVSvtx0/kU+/C0nYQLU8kZ0E4euEmZf3QQSthL5HyU4tZCHGKKPD5b1KTZgwxdgObWkRXrSYcDE3A7kUPZ9h67mZKgeAxPrPKO9Rzh5MvC5rqua1KmaGrlO5mmvAFrJA4w9Aq9djRoQHvFLi5L1rZaWIKs6XzcKBqrnsiqnBFnun3cN0Epl6YSdZtgqb755HB4CY0mKIYDfUmiyfGwu7Yhxp0wjg+fgahP8yiJCNEGc3Q4Rtgzi5BtMu7YJzrB+EZim05WX4MGDJ8VditWTRudwsrL51UhZfUMdJkbE4u0kJIHQLZbcK96sM0PdZck0oxlvEKcZHyYbb25qQGiEkfGotjcag/dYfC87KMXyPErWadCLQsDMMg5acNsUqyIojT27Luowj4wylbTYy5fsaZ+jaRyzmzaYYrx62QwSsIHJ3xUr+Tl3Ii1vZnRsU68aJbZHW/1NmPFfFBOEzG3OvHoZrXDASDc1oGIZcZ800b3MiD2BW5P7xVlOThNF601uZN5tiDM4uv/OnJK80Ka+XP8EQaqiuzxu75BtDBLtKIeG/XAak5rIrJklt7DkzuM0f0qsp8GWqHBPeoRyk+hzDrtjfgBd0Ja2q+dFHkUaZqhvDjEkRY/Bcxdcax1mtxqSJMWzZZ8ZvnQXSOU68hJ8AAAAASUVORK5CYII=",
    _sa: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAC3ElEQVR4Xp2VS0hUYRTHvyBatKhNy0JwUVAmRKW96TFFCQa1KNrkQnqQFJWOmTqmiYVFhmIR2IvosUglUxJRETWd0XFKR5Pxma9iyleWmhr175z5xnLu3LndafGHy9zvnN895/ufM8L+Fah0TiEw8xgKe4boeRplHyeQY29BQkURSvpGkVJdijtNdtQNA7VD/y9heHQZ4mQARPRapNZW4KqlCm/HAOsoUDIwBtsXOjj4C/ZvQPmHcVgIyFIm0iPRMg60TwIvewYR/uw6hMmAnhkJ65oGnji6kVhZjHRLNV5//olGglc7Z8BxZpWEWhKzD/UjQOsE8LyjH9Flebhnb0ZoTizE2SCI2A2kEKp+DcS5YAhjCCIK7sJB599PyzhlYjX9gc2Fchs/AViedQIiYTvEpT2eSjJAxG2COE/wMyuxKjsK7d9lHLe4RgWkCmM1k2nmJe2GuLjFG+QBpTOmXViQEoZIqvRafQ0sFN9N1TK80Q33CWPHFfeNUPtWywqUADWZuNLN1N71smL6gMVXDsJYXoBSt6lUYawmqizLZiVgsPx6ZXItuasV8dsgji91udvlaF8wVhs51FiWD3F6hWynP1BubfI+vKIZ5ZGZzekTxmKX5XYO4FButjSKHiCfid+KwJuR6JryzKcJY/G8OcmZARkREIk7vJPPhdBIiJh1rrsr6h12OdsvGItnScSG+jYM/06gTFsDeP2xG5UgXbAGqux+c6v8YmUliTtle+ndkbzb6JiSW6Vm0DuPLhhfcFxFIcSFjX9Bbrctu3EUi9IO4EW3E45J71ilNGFmmg8bVeYxAjRH85P3Ykn6YWRYLej9Ie9VGasmTRj3PZ/cyBvCVQ3dS9jjNNe/QCe1bHZ+9EoTxskyrGa5HUhBt6LQSWuoTuXy9UgT9oZgSVUlEKcCsTB1P4r7R3W3TE2aMFYTLdMH7xwIf5qOh61tXu/90T9hLLY/u1JtdvzRb1R6mDy+qup2AAAAAElFTkSuQmCC",
    _wo: "iVBORw0KGgoAAAANSUhEUgAAABsAAAAUCAYAAAB8gkaAAAAEjUlEQVR4Xp1Va1CUZRR+px/VTJM1Tc30J6dodCZLy7BSASklYiYcsqxJp5ou1gzJKMRFua2OyEUigTUVb4ADErCVslEEOg43gQWXhV1dgQUXQUwuiihUYvp0zvv5sZfP6Uc/Dt/yXs5zznOec17RNAa0jbusanACqS31MPQOwdg/ijzrGegt7agcuIqWKwCfb72qfNmaydT103Tfeh3oIDPdXXM34fgb2G87i+KuPuy32rD88FYCsGF9dTnENy+RLYQI98Fui0U6YyA+3zEBdJLThpFb+G1wHH3kJ9/eg4+NB+luGRpHb6OX1rr+BHr+AuyTBLYkPxEL9kbioe1hCDmSjpf3RSOsLBsF9m6EV5VAxCxC1ImfcdBml2B8+dPKQjyd8wV2UcZrjuZhRdF2zEpdBRH3GsSmJYpFvYj7t70NETEHs9Leg++BWIhH099XNpPegIh9FcMAPjEewg5TI06N3kGpYxD2Kc7gH9QNTyOD1lcZcvDAtlB5Xmz2g0gIoPvLIXRvQmwJVox/x/shtPQ7vFWSQT7zIbrIkUhe4bL4ADySvhoPU6QlPf1on1D4ttA35mQF/At1eCzjA4jEQE/n3pYcJJOovHAFRVSis0xjN9GyIC+KolumHOIIKdJyx0UpGLW4XKNoAgs+kob5ezdSRkuV4LxB1Kw2LcbKsp045hxG+7W7ArHQj5TmWsmxjHb9HGS2NePMpKeSmMp3DXr4FySjg+5UDVxTwDjIxNc9wSijpPpq6NvNqOgfm1Gr4D+smiAq8vN7NqBm6IbcZEmrQCzj2ss3SQCLiWZ/GTXX6vHMD7GscAvm7gpX6s77zMzGF6QiOUAVaAaMjWu3lJSZUFeFCufITOpqveJqKxVBqDQRC8HFaZJOOoJnctchq60F920NQTz5cO8/DRgb90NmaxMSiYKIGgPO31TWuXZFXedlv4nYV1wC0AWhuNspi69rPC6p/7HvEnaaW+k7BJNb82vA2JwEMDv7c4gNzyGoOBV/3HFl9wspiyeLiPZV6rXZX+5xBtyDbKxYrnlKU61sHduN/wDj7Fj+0hnVgfuJI+c9nh4O3ufMqIFjThplk6t3mwmUezGp/ndS86CUPddUVbUGjGfbul+LFGknBMIn90sPhzzeHkxZKcFW//Q9fnAMaGYljzHONqw8h9Q4IjO+JxjbwC0orUCCSDc1eIiFgZ/K/owUN09SuqfTqgFjY6HI2UrsmMeVNQ0Yy7zu8rScaQtpTjqnPfc56rXH9uFZ/VeyZdyBVDAeACJirpyf4msfGRBnpwHjRb3FLGvGWbj3m2o8CLiHvNdnAClgrjMzFFqaJUXCr4AGjCmLPHEUWadNHvT9X1OfpcPnerVgXFjjhTGaJJOapryXcRbe99UJ5D6JuDzCfZGjYJlaKW0eW95OWKlMCVPENLIy+R43/7kp5YHk/+tJ/pK6kduyFDzszcSSqL54neQ5iuOXpvBt6yns7uyErqEGgfRiqw0ps6WB+o4hFyElOxBAz8yiA3F4InMNROR8qTi/giQaBPNcr7v8ksX44smsj+Qo+xcctXkZpj12GwAAAABJRU5ErkJggg==",
  };
  