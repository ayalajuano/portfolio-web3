"use strict";
jQuery(function () {
    var screenWidth = $(window).width();
    $(document).ajaxComplete(function (e, xhr, settings) {
        if (xhr.getResponseHeader("REQUIRE_AUTH") == "1") {
            var browserWidth = $(window).width();
            var loginUrl = browserWidth > 1300 ? '/Home/Index' : '/Account/Login';
            xhr.abort(); // terminate further ajax execution
            window.location = loginUrl;
        }
    });

    $(document).ready(function () {
        $.ajaxSetup({ cache: false });
    });

    /* Mobile/Tablet - Open Hover Information */
    $('.load-ajax-here').on('click', '.hs-slide-in-link', function () {
        $(this).children('.hs-slide-in').toggleClass('hidden');
        $(this).parent().children('.hs-lead-info').css({
            'display': 'block',
            'opacity': 1
        });
        $(this).parent().children('.hs-slide-out-link').children('.hs-slide-out').toggleClass('hidden');
    });

    $('.load-ajax-here').on('click', '.hs-slide-out-link', function () {
        $(this).children('.hs-slide-out').toggleClass('hidden');
        $(this).parent().children('.hs-lead-info').css({
            'display': 'none',
            'opacity': 0
        });
        $(this).parent().children('.hs-slide-in-link').children('.hs-slide-in').toggleClass('hidden');
    });

    /* Close Lead Information Box or Subscription plan package on "ESC" key press */
    if ($('.hs-dashboard-body').length > 0) {
        $(document).on('keyup', function (evt) {
            if (evt.keyCode == 27) {
                var packageVisible = $(".hs-package-popover:visible").size() > 0;
                var packageHasCloseButton = $('.hs-close-btn').length > 0;
                if (packageVisible && packageHasCloseButton) {
                    $('.hs-package-popover').css('display', 'none');
                } else {
                    $('.hs-user-info').css({
                        "opacity": "0",
                        "display": "none"
                    });
                }
            }
        });
    }

    /* Show package pop-over */
    $(document).on("click", "div .hs-single-big-tile", function () {
        $(".hs-package-popover").css("display", "block");
    });



    $(document).on('click', '.hs-close-btn', function () {
        $('.hs-package-popover').css('display', 'none');
    })


    /* Interests Select Form Scroll */
    if ($('.hs-select-form-wrapper').length > 0) {
        $('.hs-interest-lists').jScrollPane();
    }

    /* Info Popover */
    if ($('.hs-info-baloon').length > 0) {
        var infoSigPos = $('.hs-info-sign').offset().left - 30;
        $('.hs-info-baloon').popover({
            'trigger': 'click',
            html: true,
            'placement': 'bottom',
            'container': 'body',
            template: '<div class="popover hs-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
            content: function () {
                var content = $(this).attr("data-popover-content");
                return $(content).children(".popover-body").html();
            }
        });

        if (screenWidth > 322 && screenWidth < 800) {
            $('.hs-info-baloon').on('shown.bs.popover', function () {
                $('.hs-popover').css('left', (infoSigPos - 280) + 'px');
                $('.popover .arrow').attr("style", "transform: skew(-49deg); left:270px !important");
                $('.hs-popover').css('visibility', 'visible');
            });
        }
        else if (screenWidth <= 322) {
            $('.hs-info-baloon').on('shown.bs.popover', function () {
                $('.hs-popover').css('left', '5px');
                $('.popover .arrow').attr("style", "transform: skew(-56deg); left:215px !important");
                $('.hs-popover').css('visibility', 'visible');
            });
        }
        else {
            $('.hs-info-baloon').on('shown.bs.popover', function () {
                $('.hs-popover').css('left', infoSigPos + 'px');
                $('.hs-popover').css('visibility', 'visible');
            });
        }
    }

    /* While on "Accounts" page, on "ESC" redirect to Dashboard */
    if ($('.hs-connect-btn').length > 0) {
        $(document).on('keyup', function (evt) {
            if (evt.keyCode == 27) {
                window.location.href = "/Admin/Dashboard/Index";
            }
        });
    }

    /* Account Dropdown - Disconnect */
    $(".hs-custom-select-lits-btn").on("click", function () {
        $(this).parent().children(($("ul.hs-custom-select-list"))).toggleClass('hs-list-open');
    });

    if ($('.hs-custom-select-lits-btn').parent().children().hasClass('hs-list-open')) {
        $('body').on('click', function () {
            $('.hs-custom-select-lits-btn').parent().children().toggleClass('hs-list-open')
        });
    }

    $(".hs-custom-select-list  a").on("click", function () {
        var selector = $(this);
        var id = $(selector).attr('data-id');
        var socialNetworkId = $(selector).attr('data-social-network-id');
        var data = { id: id };
        var url = '/ConnectAccount/DisconnectAccount';
        $.post(url, data, function (data) {
            if (data.IsSuccess == true) {
                $(selector).parents('li').remove();
            }
        });
    });

    /**
     * PUBLIC SITE !!!
     */

    /* Header - Select Singup Bottom */
    $(".singupbtn").click(function () {
        $('html, body').animate({
            scrollTop: $(".hs-sign-up-section").offset().top - ($(".hs-public-navigation-wrapper").height()+10)
        }, 2000);
    });

    /* Header - Select Category Form */
    if ($('.hs-header-form').length > 0) {

        $('.hs-category-form').jScrollPane();

        $('.hs-header-form input[type=checkbox]').change(function () {
            /*get checked state of clicked checkbox*/
            var checked = $(this).is(':checked');

            /*uncheck all*/
            $(".hs-header-form input").each(function () {
                $(this).prop('checked', '');
            });

            if (checked) {
                $(this).prop('checked', 'checked');
                $('.hs-public-slider').css({
                    'visibility': 'hidden',
                    'height': '0'
                });

                $('.hs-public-dashboard').removeClass('hs-hidden');
                var selectedCategoryId = $('.hs-header-form input[type=checkbox]:checked').val();

                $('html, body').animate({
                    scrollTop: $(".hs-public-dashboard").offset().top - 70
                }, 2000);

                doAjaxCall("/Home/LeadsByCategory/" + selectedCategoryId);
            } else {
                $('.hs-public-dashboard').addClass('hs-hidden');
                $('.hs-public-slider').css({
                    'visibility': 'visible',
                    'height': 'auto'
                });
            };
        });
    }

    /* Toggle Mobile Menu */

    if ($('.hs-mobile-toggle-menu').length > 0) {
        $('.hs-mobile-toggle-menu').on('click', function () {
            $('.hs-public-menu').toggleClass('hs-visible-menu');
        });
    }

    /* Slider */
    if ($('.bxslider').length > 0) {
        $(document).ready(function () {
            var slider = $('.bxslider').bxSlider({
                mode: 'horizontal',
                startSlide: 0,
                infiniteLoop: true,
                speed: 1200,
                auto: true,
                autoStart: true,
                pause: 6000,
                responsive: true,
                touchEnabled: true,
                controls: false,
                adaptiveHeight: false,
                slideMargin: 100,
                easing: 'linear'
            });
        });
    }
    function viewport() {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        return { width: e[a + 'Width'], height: e[a + 'Height'] };
    }


    function ResizeMediumTileHeight() {
        var MaxScreenWidth2Tile = 371;
        //only resize for 2 tiles

        if (viewport().width < MaxScreenWidth2Tile) {
            var tileWidth = $('.hs-medium-tile > .img-responsive').width();
            $('.hs-medium-tile').attr('style', 'height:' + tileWidth + 'px');
        } else {
            $('.hs-medium-tile').attr('style', '');
        }
    }

    $(window).resize(function () {
        ResizeMediumTileHeight();
    });

    function hsLoadingEffect(url) {
        $('.chart').easyPieChart({
            animate: 7000,
            barColor: '#f15b22',
            lineWidth: 10,
            lineCap: 'square',
            scaleColor: false,
            trackColor: false,
            size: 150,
            onStep: function (from, to, percent) {
                $(this.el).find('.hs-percent').text(parseInt(percent) + "%");


                if (percent >= 0 && percent <= 33) {
                    $('.hs-load-text').text('Finding prospects on Twitter');
                } else if (percent > 33 && percent <= 66) {
                    $('.hs-load-text').text('Finding prospects on Google Plus');
                } else if (percent > 66 && percent < 99) {
                    $('.hs-load-text').text('Finding prospects on LinkedIn');
                } else {
                }
            },
            onStop: function () {
                var shouldUpdateMediumTiles = false;
                if (url.indexOf('GetDashboard') != -1) {
                    shouldUpdateMediumTiles = true;
                }
                hsMediator(false, true, shouldUpdateMediumTiles);
            }
        });
    }

    var prv = false;
    var vtor = false;

    function hsMediator(ajaxDone, loadingDone, shouldUpdateMediumTileSizes) {
        if (ajaxDone) {
            prv = true;
        }

        if (loadingDone) {
            vtor = true;
        }

        if (prv && vtor) {
            $('.hs-loading').css('display', 'none');
            $('.load-ajax-here').removeClass('hs-hidden');
            $('.hs-load-text').text('');
            $('.chart').data('easyPieChart', null);
            $('.chart').find('canvas:last').remove();

            if ($('.hs-package-visible').length > 0) {
                $('.hs-package-popover').css('display', 'block');
            }

            if (shouldUpdateMediumTileSizes) {
                ResizeMediumTileHeight();
            }

            prv = false;
            vtor = false;
        } else
            if (prv == false && vtor == false) {
                $('.hs-load-text').text('Connection issue...');
            }
    }
    //filename is url name /categoryId
    /* Public Dashboard Loading */
    function doAjaxCall(url) {

        $.ajax({
            url: url,
            cache: false,
            error: function () {
                hsMediator(false, false, false);
                $('.hs-loading').css({
                    'display': 'block'
                });

                setTimeout(function () {
                    $('.hs-loading').css('display', 'none');
                    $('.hs-public-slider').css({
                        'visibility': 'visible',
                        'height': 'auto'
                    });

                    $('.chart').data('easyPieChart', null);
                    $('.chart').find('canvas:last').remove();
                }, 7000);
            },
            success: function (data) {
                hsMediator(true, false, false);
                $('.load-ajax-here').html(data);
            },
            beforeSend: function () {
                $('.load-ajax-here').addClass('hs-hidden');
                $('.hs-loading').css('display', 'block');
                hsLoadingEffect(url);
            }
        });
    }

    if ($('#admin-dashboard').length > 0) {
        var browserWidth = $(window).width();
        var page = $('#admin-dashboard').attr("data-page-number");
        var accountStatus = $("#admin-dashboard").attr('data-account-status');

        doAjaxCall("/Dashboard/GetDashboard?browserWidth=" + browserWidth + "&page=" + page + "&accountStatus=" + accountStatus);//Dashboard admin url
    }

    /* Responsive Plan Box UI */
    if ($('.hs-package-section').length > 0) {
        var navElement = $('.hs-plans-navigation-list li');

        $(navElement).on('click', function () {
            var currentPlan = $('.hs-single-plan.current');
            var currentPlanIndex = currentPlan.index();
            var navElementIndex = $(this).index();

            // Add .current to clicked plan box
            $('.hs-single-plan').removeClass('current');
            $('.hs-single-plan:eq(' + navElementIndex + ')').addClass('current');
            // Change active navigation circle
            $(navElement).removeClass('current');
            $(this).addClass('current');
        });
    }


    /* Dashboard Click */
    if ($('.hs-public-dashboard').length > 0) {

        $('.load-ajax-here').on('click', '.hs-tile', function (e) {
            var isUserLogged = $('.hs-user-note[data-user-id]').is('[data-user-id]');
            var clickedNode = e.target.nodeName;
            var clickedClass = e.target.classList[0];
            var listHeight = $('.hs-public-list-tiles').innerHeight();
            var listWidth = $('.hs-public-list-tiles').innerWidth();

            // Prevent opening popover od redirect when clicking on the stripe
            if (clickedClass == 'hs-slide-in' || clickedClass == 'hs-slide-out' || clickedClass == 'fa') {
                console.log('clicked on ok class');
                return;
            }

            if (isUserLogged) { // Redirect to Dashboard
                window.location.assign("/Admin/Dashboard/Index");
            } else { // Show Popover

                var numOfTiles = $('.hs-public-list-tiles li').length;

                if (numOfTiles < 11) {
                    $('.hs-message').css({
                        'font-size': '20px',
                        'line-height': '26px'
                    });
                }

                $('.hs-full-access-popover').css({
                    'width': listWidth + 'px',
                    'height': listHeight + 'px',
                    'display': 'block'
                });
                $('.hs-message').css('padding-top', (listHeight / 2 - 20) + 'px');
            }
        });

        // Close Popover on 'X'
        $('.load-ajax-here').on('click', '.addListModal', function () {
         });

        // Close Popover on 'X'
        $('.load-ajax-here').on('click', '.hs-close-popover', function () {
            $('.hs-full-access-popover').css('display', 'none');       
        });

        // Close Popover on 'ESC'
        $(document).on('keyup', function (evt) {
            if (evt.keyCode == 27) {
                $('.hs-full-access-popover').css('display', 'none');                
            }
        });
    }

    $("#export-prospects").on('click', function (e) {
        e.preventDefault();
        var form = $("<form action='/Dashboard/ExportToCsv' method='post' style='display:none;'></form>")
        form.appendTo(document.body);
        form.submit();
        form.remove();
    });


    if ($(document).outerWidth() < 1300) {
        if ($('.hs-public-dashboard').length > 0) {
            var dashboardWidth = $('.container-fluid').innerWidth();
            var numOfTilesInRow = parseFloat(dashboardWidth / 122);
            var correctedNumOfTilesInRow = parseInt(numOfTilesInRow - 0.32);
            var twoRectanglesWidth = (correctedNumOfTilesInRow - 2) * 122;
            var singleRectangleWidth = twoRectanglesWidth / 2;

            if (correctedNumOfTilesInRow == 5) {
                $(document).ajaxComplete(function () {
                    $('.hs-col-1').css('width', '122px');
                    $('.hs-col-2, .hs-col-3').css('width', '244px');
                });
            } else {
                $(document).ajaxComplete(function () {
                    $('.hs-col-2, .hs-col-3').css('width', singleRectangleWidth + 'px');
                });
            }
        }
    }

    $(".hs-choose-categories label input[type=checkbox]").change(function () {
        var selector = $(this);
        if ($(selector).is(':checked')) {
            var numberOfSelectedCategories = $('.hs-choose-categories label input[type=checkbox]:checked').size();
            var canCheckCategory = checkIfNumberOfAllowedCategoriesReached(selector, numberOfSelectedCategories);
            if (canCheckCategory == false)
                return false;
        }
    });
    /* *ABOUT PAGE DASH LINE */

    $(window).resize(function () {
        var aboutDash = $(".about-dash");
        var aboutDashCol = $(".about-dash .hs-col-2:first");
        var timeLineDashed = $(".time-line-dashed");
        if (aboutDashCol.length) {
            var result = aboutDashCol.offset().left + aboutDashCol.outerWidth() / 2;
            timeLineDashed.css("width", result);
        }
        var heightTotal = 0;
        for (var i = 1; i < $(".about-dash .row").length ; i++) {
            heightTotal += $(".about-dash .row").get(i).offsetHeight;
        }
        timeLineDashed.css("height", heightTotal);
        $().lineMenu();
    });
    $(window).ready(function () {
        var aboutDash = $(".about-dash .hs-col-2:last");
        var aboutDashCol = $(".about-dash .hs-col-2:first");
        var timeLineDashed = $(".time-line-dashed");
        var heightTotal = 0;
        for (var i = 1; i < $(".about-dash .row").length ; i++) {
            heightTotal += $(".about-dash .row").get(i).offsetHeight;
        }
        if (aboutDash.length) {
            timeLineDashed.css("height", heightTotal);
            var result = aboutDashCol.offset().left + aboutDashCol.outerWidth() / 2;
            timeLineDashed.css("width", result);
        }
        $().lineMenu();

        var listLeads = $('#hs-list-leads');
        if (window.location.href.split("#").length == 2) {
            if (window.location.href.split("#")[1] == "teamPage") {
                $('html, body').animate({
                    scrollTop: $("#teamPage").offset().top
                }, 1);
            }
            if (window.location.href.split("#")[1] == "locationContact") {
                $('html, body').animate({
                    scrollTop: $("#locationContact").offset().top
                }, 1);
            }
        }
    });
    $(window).scroll(function () {
        $().lineMenu();
    });
    $(".aboutMenu a").click(function () {
        if ($(".hs-about-body").length) {
            $('html, body').animate({
                scrollTop: 0
            }, 2000);
            return false;
        }
    });
    $(".teamMenu a").click(function () {
        if ($("#locationContact").length) {
            $('html, body').animate({
                scrollTop: $("#teamPage").offset().top
            }, 2000);
            return false;
        }
    });
    $(".contactMenu a").click(function () {
        if ($("#locationContact").length) {
            $('html, body').animate({
                scrollTop: $("#locationContact").offset().top
            }, 2000);
            return false;
        }
    });
    var listLeadsData = null;
    var prospectToRemoveDashboard = null;
    jQuery.fn.extend({
        lineMenu: function () {
            var bodyAbout = $(".hs-about-body");
            if (bodyAbout.length) {
                if ($(window).scrollTop() >= $("#locationContact").offset().top) {
                    $(".teamMenu a").css("border-bottom", "0px solid #f15b22");
                    $(".contactMenu a").css("border-bottom", "2px solid #f15b22");
                    $(".aboutMenu a").css("border-bottom", "0px solid #f15b22");
                    $('.hs-public-menu').removeClass('hs-visible-menu');
                } else if ($(window).scrollTop() >= $("#teamPage").offset().top) {
                    $(".teamMenu a").css("border-bottom", "2px solid #f15b22");
                    $(".contactMenu a").css("border-bottom", "0px solid #f15b22");
                    $(".aboutMenu a").css("border-bottom", "0px solid #f15b22");
                    $('.hs-public-menu').removeClass('hs-visible-menu');
                } else {
                    $(".teamMenu a").css("border-bottom", "0px solid #f15b22");
                    $(".contactMenu a").css("border-bottom", "0px solid #f15b22");
                    $(".aboutMenu a").css("border-bottom", "2px solid #f15b22");
                    $('.hs-public-menu').removeClass('hs-visible-menu');
                }
            }
        },

        getListLeads: function () {
              $.getJSON($("#get-list-leads").val(), {
                idUser: $('.hs-user-info').attr('data-id'),
                searchText: $('#search-list-leads').val()
            })
            .done(function (data) {
                listLeadsData = data;
                var listLeads = $('.hs-list-leads');
                listLeads.html("");
                $.each(listLeadsData, function (i, list) {
                    var checked = "";
                    if (list.InList == 1) {
                        checked = "checked";
                    }
                    listLeads.append('<div class="checkbox"><input type="checkbox" ' + checked + ' class="list-leads-cbox" text-value="' + list.Text + '" value="' + list.Id + '"><label for="checkbox">' + list.Text + '</label></div>');
                });
            });
        },

        addUserListLeads: function (listLeads) {

            $.post($("#add-user-list-leads").val(), {
                idUser: $('.hs-user-info').attr('data-id'),
                idListLeads: listLeads.val()
            })
            .done(function () {
                prospectToRemoveDashboard = $('.hs-user-info').attr('data-id');
               $.amaran({
                    'message': 'Saved to: ' + listLeads.attr("text-value")
                });
                
            }).fail(function () {
                listLeads.prop('checked', false);
            });
        },

        removeUserListLeads: function (listLeads) {

            $.post($("#remove-user-list-leads").val(), {
                idUser: $('.hs-user-info').attr('data-id'),
                idListLeads: listLeads.val()
            })
            .done(function () {
                $.amaran({
                    'message': 'Removed from: ' + listLeads.attr("text-value")
                });
            }).fail(function () {
                listLeads.prop('checked', true);
            });
        },

        addListLeads: function () {
            $.post($("#create-list-leads").val(), {
                idUser: $('.hs-user-info').attr('data-id'),
                nameList: $('#create-list-leads-field').val()
            })
            .done(function (data) {
                prospectToRemoveDashboard = $('.hs-user-info').attr('data-id');
                $.amaran({
                    'message': 'Saved to: ' + $('#create-list-leads-field').val()
                });
                $("#hs-create-list-field").addClass("hidden");
                $("#new-list-appear-field").removeClass("hidden");
                $().getListLeads();
            }).fail(function (data) {

            });
        },

        checkSearchLeadLists: function (string) {
            var result = true;
            var stringSplitted = $(".search-list-leads").val().split(" ");
            var item;
            for (item in stringSplitted) {
                if (string.toLowerCase().indexOf(stringSplitted[item].toLowerCase()) <= -1) {
                    result = false;
                }
            }
            return result;
        },

        getLeadListUserAll: function () {
            $.getJSON($("#lead-list-user-all").val(), {
            })
            .done(function (data) {
                var listListLeads = $('#list-list-leads-box');
                listListLeads.html("");
                var listSelected = "";
                var listHtml = "";
                var listItemCount = 0;
                $.each(data, function (i, list) {
                    listHtml += '<div class="col-md-6 col-xs-6 listResol"; ><div class="box-list">';
                    listHtml += '<div class="hs-view-prospects">'
                    if (list.ListName != "Archived Prospects") {
                        listHtml += '<span data-id="' + list.ListId + '" data-name="' + list.ListName + '" class="glyphicon glyphicon glyphicon-trash delete-lead-list" aria-hidden="true"></span>';
                    }
                    listHtml += '<div class="hs-view-prospects-btn" data-count="' + list.NumberUsersList + '" data-id="' + list.ListId + '" data-name="' + list.ListName + '"><span>View Prospects</span></div></div>';
                    listHtml += '<div class="hs-view-prospects-delete"><div>Are you sure you want to delete this list?</div><div><span class="confirmed-delete-lead-list"  data-id="' + list.ListId + '" data-name="' + list.ListName + '" >Archive</span> <span class="cancel-delete-lead-list">Cancel</span></div><div>All profiles on this list will be moved onto the list "Archived Prospects" so you can restore them in the future if you change your mind.</div></div>';
                    if (list.ListUsers != null) {
                        if (list.ListUsers.length == 0) {
                            listHtml += '<div class="box-imgs text-center"><img class="img-empty" src="/assets/img/emptylist.png">';
                        } else {
                            listHtml += '<div class="box-imgs">';
                            $.each(list.ListUsers, function (j, lead) {
                                listItemCount++;
                                listHtml += '<img class="img-' + listItemCount + '" src="' + lead.Profile_Image + '" onerror="replaceDefaultImage(this,\'twitter\',\'' + lead.Profile_Image + '\');">';
                            });
                        }
                    } else {
                        listHtml += '<div class="box-imgs text-center"><img class="img-empty" src="/assets/img/emptylist.png">';
                    }
                    listHtml += '</div><div class="box-text">'
                        + '<div class="text-center title-list">' + list.ListName + '</div>'
                        + '<div class="text-center">' + list.NumberUsersList + ' Prospects</div>'
                        + '<div class="text-center">Last modification ' + moment(list.DateModification, "DD/MM/YYYY hh:mm:ss").format("DD MMM, YYYY") + '</div></div></div>';
                    listHtml += '<div class="box-list-mobile">';
                    listHtml += '<div class="hs-view-prospects-delete"><div>Are you sure you want to delete this list?</div><div><span class="confirmed-delete-lead-list"  data-id="' + list.ListId + '" data-name="' + list.ListName + '" >Archive</span> <span class="cancel-delete-lead-list">Cancel</span></div><div>All profiles on this list will be moved onto the list "Archived Prospects" so you can restore them in the future if you change your mind.</div></div>';
                    listHtml += '<div class="box-imgs text-center hs-view-prospects-btn" data-count="' + list.NumberUsersList + '" data-id="' + list.ListId + '" data-name="' + list.ListName + '">';
                    listHtml += '<div class="text-left pull-left">' + list.ListName + '</div>';
                    listHtml += '<div class="text-left pull-right" ><span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span></div>';
                    listHtml += '</div>';
                    listHtml += '<div class="box-text">';
                    listHtml += '<div class="text-left">' + list.NumberUsersList + ' Prospects</div>'
                    listHtml += '<div class="text-left">Last modification' + moment(list.DateModification, "DD/MM/YYYY hh:mm:ss").format("DD MMM, YYYY") + '</div>';
                    listHtml += '<div class="delete-lead-list" data-id="' + list.ListId + '" data-name="' + list.ListName + '">';
                    listHtml += '<span class="glyphicon glyphicon glyphicon-trash" aria-hidden="true"></span>';
                    listHtml += '</div>';
                    listHtml += '</div>';
                    listHtml += '</div>';
                    listHtml += '</div>';

                    listItemCount = 0;
                });
                listListLeads.append(listHtml);
            }).fail(function (data) {
                console.log("Error");
            });
        },

        removeListLeads: function (idListLead, nameListLead) {

            $.post($("#remove-lead-list").val(), {
                idListLead: idListLead
            })
            .done(function (data) {
                $.amaran({
                    'message': 'List ' + nameListLead + ' was deleted.'
                });
                $().getLeadListUserAll();
            }).fail(function (data) {
                console.log("Error");
            });
        },


        // Shows prospect inside list (when clicked)
        getLeadInsideList: function (idList) {
            $.getJSON($("#lead-insede-list").val(), {
                idList: idList
            })
            .done(function (data) {
                var listLeads = $('.hs-tiles-list');
                listLeads.html("");
                var liString = "";
                liString = '<li class="hs-user-info" style="display: none; opacity: 1; margin-bottom: -6px;width: 100%; margin-top: -8px; ">'
                    + '<div class="divce" style="height: 251px; background-color: #C8C3C5; color: white;">'
                    + '<div class="row"><div class="hs-user-info-list"><div class="hs-lead-options">'
                    + '<div class="hs-add-to-list-wrapper"></div><ul class="list-unstyled hs-options-list">'
                    + '<li class="hs-add-to-list-btn" data-toggle="modal" data-target="#addListModal">'
                    + '<a href="#">Add to a List</a><span class="hs-add-icon"></span></li><li><a href="#">Snooze</a>'
                    + '<span class="hs-clock-icon"></span></li>';
                if ($("#hs-list-leads-prospects .panel-title").html() != "Archived Prospects") {
                    liString += '<li class="hs-delete-btn" data-toggle="modal" data-target="#deleteModal"><a href="#">Archive</a><span class="hs-close-icon"></span></li>';
                }
                liString += '<li><a href="#">Connect</a><span class="hs-comment-icon"></span></li></ul></div></div><div class="hs-user-info-list-mobile">'
                    + '<ul class="list-inline"><li class="hs-add-to-list-btn" data-toggle="modal" data-target="#addListModal">'
                    + '<span class="hs-add-icon"></span></li><li><a href="#"><span class="hs-clock-icon"></span></a></li>';
                if ($("#hs-list-leads-prospects .panel-title").html() != "Archived Prospects") {
                    liString += '<li class="hs-delete-btn" data-toggle="modal" data-target="#deleteModal"><span class="hs-close-icon"></span></li>';
                }
                liString += '<li><a href="#"><span class="hs-comment-icon"></span></a>'
                    + '</li></ul></div><div class="hs-user-info-user"><div class="hs-user-info-wrapper">'
                    + '<div class="hs-lead-personal-info"><div class="hs-lead-avatar">'
                    + '<img src="/assets/img/avatars/pic1.jpg" class="img-responsive" /></div><div class="hs-lead-name-wrapper">'
                    + '<h2 class="hs-lead-name"></h2><div class="hs-lead-big-rating"><span>Score: 0</span></div></div></div><div class="hs-lead-bio">'
                    + '<div class="bio twitter-bio hs-ellipsis-bottom-right"><span id="twitter-description"></span></div>'
                    + '<div class="bio googleplus-bio hs-ellipsis-bottom-right hidden"><div>Occupation: <span id="googleplus-occupation"></span>'
                    + '</div><div>Workskills: <span id="googleplus-workskills"></span></div><div>About: <span id="googleplus-about"></span></div></div>'
                    + '<div class="bio linkedin-bio hs-ellipsis-bottom-right hidden"><div class="linkedin-bio-location">'
                    + '<span class="hs-lead-location" id="linkedIn-location"></span></div><div class="linkedin-bio-web">'
                    + '<span id="linkedIn-webpage"></span></div><div id="linkedIn-headline"></div><div id="linkedIn-employer"></div>'
                    + '<div id="linkedIn-industry"></div></div></div></div></div><div class="hs-user-info-tabs hs-user-info-tabs-list">'
                    + '<div class="hs-tabs-wrapper"><div role="tabpanel"><ul class="nav nav-tabs nav-justified" role="tablist" id="tabs"><li role="presentation" data-tab-for="twitter-bio">'
                    + '<a href="#twitter" aria-controls="twitter" role="tab" data-toggle="tab"><img src="/assets/img/twitter-dark-sm.png" class="img-responsive hs-social-tabs-icon" /><span class="hs-lead-tab-connections-nun" id="lead-twitter-followers">500</span></a></li><li role="presentation" data-tab-for="googleplus-bio"><a href="#googleplus" aria-controls="googleplus" role="tab" data-toggle="tab"><img src="/assets/img/google-grey-sm.png" class="img-responsive hs-social-tabs-icon" /><span class="hs-lead-tab-connections-nun" id="lead-googleplus-followers">1000+</span></a></li><li role="presentation" class="" data-tab-for="linkedin-bio"><a href="#linkedin" aria-controls="linkedin" role="tab" data-toggle="tab"><img src="/assets/img/linkedin-dark-sm.png" class="img-responsive hs-social-tabs-icon" /><span class="hs-lead-tab-connections-nun" id="lead-linkedin-connections">23</span></a></li></ul><div class="tab-content" id="tab-content"><div role="tabpanel" class="tab-pane" id="twitter" data-has-twitter-account=""><div class="hs-lead-about-info-wrapper"><div class="hs-lead-about-info twitter-bio"><div class="hs-lead-about-name" id="twitter-lead-name"></div><div class="hs-lead-location" id="twitter-location"></div><div class="hs-lead-webpage"><span id="twitter-webpage"></span></div></div></div><div class="hs-latest-tweets" data-counter="1"></div></div><div role="tabpanel" class="tab-pane" id="googleplus" data-has-googleplus-account=""><div class="hs-lead-about-info-wrapper hs-lead-google-plus-about-info"><div class="hs-lead-gplus-location hs-lead-gplus-tab-info"></div><div class="hs-lead-gplus-mail hs-lead-gplus-tab-info"></div><div class="hs-lead-gplus-web hs-lead-gplus-tab-info"></div></div><div class="hs-latest-google" data-counter="1"></div></div><div role="tabpanel" class="tab-pane" id="linkedin"><div class="linkedin-bio">Prospect\' summary will be displayed here shortly.</div></div></div></div></div></div></div></div><div class="clearfix"></div></li>';
                listLeads.append(liString);
                $.each(data.Response.ListUsers, function (i, list) {
                    liString = '<li class="hs-medium-tile" data-id="' + list.ID + '">';
                    liString += '<span hidden="" class="hs-lead-bio-twitter">' + Strings.orEmpty(list.TwitterDescription) + '</span>';
                    liString += '<span hidden="" class="hs-lead-fullname-twitter">' + Strings.orEmpty(list.TwitterFullName) + '</span>';
                    liString += '<span hidden="" class="hs-lead-screen-name-twitter">' + Strings.orEmpty(list.TwitterScreenName) + '</span>';
                    liString += '<span hidden="" class="hs-lead-location-twitter">' + Strings.orEmpty(list.TwitterLocation) + '</span>';
                    liString += '<span hidden="" class="hs-lead-webpage-twitter">' + Strings.orEmpty(list.TwitterUserWebpageUrl) + '</span>';
                    liString += '<span hidden="" class="hs-lead-profile-image-twitter">' + Strings.orEmpty(list.TwitterProfileImageUrl) + '</span>';
                    liString += '<span hidden="" class="hs-lead-bio-linkedIn">' + Strings.orEmpty(list.LinkedInDescription) + '</span>';
                    liString += '<span hidden="" class="hs-lead-fullname-linkedIn">' + Strings.orEmpty(list.LinkedInFullName) + '</span>';
                    liString += '<span hidden="" class="hs-lead-profile-url-linkedIn">' + Strings.orEmpty(list.LinkedInProfileUrl) + '</span>';
                    liString += '<span hidden="" class="hs-lead-location-linkedIn">' + Strings.orEmpty(list.LinkedInLocation) + '</span>';
                    liString += '<span hidden="" class="hs-lead-webpage-linkedIn">' + Strings.orEmpty(list.LinkedInUserWebpageUrl) + '</span>';
                    liString += '<span hidden="" class="hs-lead-industry-linkedIn">' + Strings.orEmpty(list.LinkedInIndustry) + '</span>';
                    liString += '<span hidden="" class="hs-lead-employer-linkedIn">' + Strings.orEmpty(list.LinkedInEmployer) + '</span>';
                    liString += '<span hidden="" class="hs-lead-occupation-gplus">' + Strings.orEmpty(list.GooglePlusOccupation) + '</span>';
                    liString += '<span hidden="" class="hs-lead-workskills-gplus">' + Strings.orEmpty(list.GooglePlusWorkSkills) + '</span>';
                    liString += '<span hidden="" class="hs-lead-about-gplus">' + Strings.orEmpty(list.GooglePlusAbout) + '</span>';
                    liString += '<span hidden="" class="hs-lead-location-gplus">' + Strings.orEmpty(list.GooglePlusLocation) + '</span>';
                    liString += '<span hidden="" class="hs-lead-email-gplus">' + Strings.orEmpty(list.GooglePlusEmail) + '</span>';
                    liString += '<span hidden="" class="hs-lead-webpage-gplus">' + Strings.orEmpty(list.GooglePlusUserWebpageUrl) + '</span>';
                    liString += '<span hidden="" class="hs-lead-profile-url-gplus">' + Strings.orEmpty(list.GooglePlusProfileUrl) + '</span>';
                    liString += '<span hidden="" class="hs-lead-profile-name">' + Strings.orEmpty(list.GooglePlusUsername) + '</span>';
                    liString += '<a href="javascript:void(0);" class="hs-slide-in-link"><div class="hs-slide-in"><span class="fa fa-angle-right"></span></div></a>';
                    liString += ' <div class="hs-lead-info"><div class="hs-lead-name">' + list.FullName + '</div><div class="hs-lead-networks"><div class="hs-network"><img src="/assets/img/twitter-dark-sm.png" class="img-responsive hs-social-icon"><span class="followers">' + list.TwitterFollowers + '</span></div><div class="hs-network"><img src="/assets/img/google-dark-sm.png" class="img-responsive hs-social-icon"><span class="followers">' + list.GooglePlusFollowers + '</span></div><div class="hs-network"><img src="/assets/img/linkedin-dark-sm.png" class="img-responsive hs-social-icon"><span class="followers">' + list.LinkedInConnections + '</span></div></div></div>';
                    liString += '<div class="hs-lead-rating">' + list.Score + '</div>';
                    liString += '<a href="javascript:void(0);" class="hs-slide-out-link"><div class="hs-slide-out hidden"><span class="fa fa-angle-left"></span></div></a>';
                    liString += '<img src="' + list.DefaultProfileImageUrl + '" onerror="replaceDefaultImage(this,\'twitter\',\'' + list.DefaultProfileImageUrl + '\');" class="img-responsive">';
                    liString += '</li>';
                    listLeads.append(liString);
                });
            }).fail(function (data) {
                console.log("Error");
            });
        },

        removeProspectDashboard: function () {
            if (prospectToRemoveDashboard != null) {
                $("[data-id='" + prospectToRemoveDashboard + "']").addClass("disabled");
                prospectToRemoveDashboard = null;
                countRemovedProspects++;
                if (countRemovedProspects >= 10) {
                    $("#hs-loading-screen").addClass("active");
                    window.DashboardMenu.refreshDashboard(1);
                    countRemovedProspects = 0;
                }
                
            }
        },

        removeUser: function (idListLead) {
            $.post($("#delete-user").val(), {
                idUser: $('.hs-user-info').attr('data-id')
            })
            .done(function (data) {
                $.amaran({
                    'message': 'Prospect Archived.'
                });
                $("#deleteModal").modal('hide');
                $().getLeadInsideList(idListLead);
            }).fail(function (data) {
                console.log("Error");
            });
        }
    });

    var countRemovedProspects = 0;

    $(document).on("hidden.bs.modal", "#addListModal", function () {
        $().removeProspectDashboard();
    })

    $(document).on("hidden.bs.modal", "#deleteModal", function () {
        $().removeProspectDashboard();     
        
    })

  
    var Strings = {};

    Strings.orEmpty = function (entity) {
        if (!entity) {
            return "";
        }
        return entity;
    };

    $(document).on("click", "div .hs-add-to-list-btn", function () {
        $("#addListModal .modal-body #name").html($(".hs-lead-name a").html());
        $("#addListModal .modal-body #img-model img").attr('src', ($(".hs-lead-avatar img").attr('src')));
        $().getListLeads();
        $("#addListModal .modal-body #score").html($(".hs-lead-big-rating").html());
        $("#addListModal .modal-body #link").html($("#linkedIn-webpage").html());
        $("#addListModal .modal-body #location").html($("#twitter-location").html());
        $("#addListModal .modal-body #title").html($("#twitter-description").html());
        $("#addListModal #search-list-leads").val("");
    });

    $(document).on("click", "li .hs-delete-btn", function () {
        $("#deleteModal .modal-body #name").html($(".hs-lead-name a").html());
        $("#deleteModal .modal-body #img-model img").attr('src', ($(".hs-lead-avatar img").attr('src')));
        $("#deleteModal .modal-body #score").html($(".hs-lead-big-rating").html());
        $("#deleteModal .modal-body #link").html($("#linkedIn-webpage").html());
        $("#deleteModal .modal-body #location").html($("#twitter-location").html());
        $("#deleteModal .modal-body #title").html($("#twitter-description").html());
    });

    $(document).on('click', '#new-list-appear-field', function () {
        $("#create-list-leads-field").val("");
        $("#new-list-appear-field").addClass("hidden");
        $("#hs-create-list-field").removeClass("hidden");
        $("#create-list-leads-field").focus();
    });

    $(document).on('click', '#create-list-cancel', function () {
        $("#hs-create-list-field").addClass("hidden");
        $("#create-list-leads-field").val("");
        $("#new-list-appear-field").removeClass("hidden");
    });

    $(document).on('click', '#search-cancel', function () {
        $(".search-list-leads").val("");
        $("#search-cancel").removeClass("active");
        $().getListLeads();
    });

    $(document).on('click', '#create-new-list-btn', function () {
        if ($('#create-list-leads-field').val().length) {
            $(".search-list-leads").val("");
            $().addListLeads();
        }
    });

    $(document).on('keyup', '#create-list-leads-field', function (e) {
        var key = e.which;
        if (key == 13)  // the enter key code
        {
            $('#create-new-list-btn').click();
            return false;
        }
    });

    $(document).on('click', '.delete-lead-list', function () {
        var parentDiv = $(this).parent().parent();
        parentDiv.removeClass("active");
        parentDiv.addClass("delete");

    });

    $(document).on('click', '.confirmed-delete-lead-list', function () {
        $().removeListLeads($(this).attr('data-id'), $(this).attr('data-name'));
        $().getListLeads();        
    });

    $(document).on('click', '.cancel-delete-lead-list', function () {
        var parentDiv = $(this).parent().parent().parent();
        parentDiv.removeClass("delete");
        parentDiv.addClass("active");

    });


    // Get Name and number of prospects from list
    $(document).on('click', '.hs-view-prospects-btn', function () {
        if ($(this).attr('data-count') != "0") {
            $("#listId").val($(this).attr('data-id'));
            $("#listName").val($(this).attr('data-name'));
            $("#NumberUsersList").val($(this).attr('data-count'));
            $("#call-list-prospect-page").submit();
        } else {
            $(this).html("<span>Empty</span>")
        }
    });

    $(document).on('click', '.confirmed-delete-lead', function () {
        $().removeUser($(this).attr('data-id'));
        //add shadow to profile photo
        prospectToRemoveDashboard = $('.hs-user-info').attr('data-id');

    });

    
    $(document).on('change', '.list-leads-cbox', function () {
        if ($(this).prop('checked')) {
            $().addUserListLeads($(this));
        } else {
            $().removeUserListLeads($(this));
        }
    });

    $(document).on('mouseenter', '.box-list', function () {
        if (!$(this).hasClass("delete")) {
            $(this).addClass("active");
        }
    });

    $(document).on('mouseleave', '.box-list', function () {
        $(this).removeClass("active");
    });

    $(document).on('keyup', '.search-list-leads', function () {
        var listLeads = $('.hs-list-leads');
        listLeads.html("");
        $.each(listLeadsData, function (i, list) {
            if ($().checkSearchLeadLists(list.Text)) {
                var checked = "";
                if (list.InList == 1) {
                    checked = "checked";
                }
                listLeads.append('<div class="checkbox"><input type="checkbox" ' + checked + ' class="list-leads-cbox" text-value="' + list.Text + '" value="' + list.Id + '"><label for="checkbox">' + list.Text + '</label></div>');
            }
        });
        if ($(this).val().length) {
            $("#search-cancel").addClass("active");
        } else {
            $().getListLeads();
            $("#search-cancel").removeClass("active");
        }
    });

    /* *SERVICES PAGE */

    $(window).resize(function () {
        var row = $(".center-vertical-services-js");
        var divToChange = $(".center-vertical-services");
        var arrayRowHeight = [];
        row.each(function () {
            arrayRowHeight.push($(this).height());
        });
        if (divToChange.length) {
            divToChange.each(function (key, value) {
                $(this).css("margin-top", (arrayRowHeight[key] / 2 - $(this).height() / 2));
            });
        }
    });
    $(window).ready(function () {
        if($(this).width() > 1000){
            var row = $(".center-vertical-services-js");
            var divToChange = $(".center-vertical-services");
            var arrayRowHeight = [];
            row.each(function () {
                arrayRowHeight.push($(this).height());
            });
            if (divToChange.length) {
                divToChange.each(function (key, value) {
                    $(this).css("margin-top", (arrayRowHeight[key] / 2 - $(this).height() / 2));
                });
            }
        }
    });
});
function replaceDefaultImage(image, primaryProfileImage, twitterImageUrl) {

    //check scenario when linkedin photo is default and broken 
    if (primaryProfileImage == "linkedIn") {
        //check whether twitter is broken also
        if (image.getAttribute("data-twitter-image-set") === "1") {
            image.src = "/assets/img/no_profile_image_twitter.png";
        }
        else {
            //if user has twitter account then try to set twitter photo as profile 
            if (!(twitterImageUrl == null || twitterImageUrl.length == 0)) {
                image.src = twitterImageUrl;
                image.setAttribute("data-twitter-image-set", "1");
            }//user has no twitter account so set linked in default image
            else {
                image.src = "/assets/img/no_profile_image_linkedIn.png";
            }
        }
    }
    else //user has twitter account but profile image is broken, so display default egg image
    {
        image.src = "/assets/img/no_profile_image_twitter.png";
    }

    return true;
}

function checkIfNumberOfAllowedCategoriesReached(selector, numberOfSelectedCategories) {
    var availableCategories = parseInt($('.hs-choose-categories').attr('data-available-categories'), 10);
    if (numberOfSelectedCategories > availableCategories) {
        $(selector).prop('checked', '');
        return false;
    }
    return true;
}

function checkIfNumberOfAllowedKeywordsReached(selector, numberOfSelectedKeywords) {
    var availableKeywords = parseInt($('.hs-menu-keywords').parent().attr('data-available-keywords'), 10);
    if (numberOfSelectedKeywords > availableKeywords) {
        $(selector).prop('checked', '');
        return false;
    }
    return true;
}

function checkIfNumberOfAllowedKeywordsAlreadyReached(numberOfSelectedKeywords) {
    var availableKeywords = parseInt($('.hs-menu-keywords').parent().attr('data-available-keywords'), 10);
    if (numberOfSelectedKeywords >= availableKeywords) {
        return true;
    }
    return false;
}