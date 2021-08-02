jQuery(document).ready(function(){
    $(function() {
        var maps = [
            {
                slug: 'de_dust2', name: 'Dust2',
                smokes: [
                    {id: 'cqGyahIPY6c', start: '2:22', end: '2:34', name: 'Старт зига'},
                    {id: 'cqGyahIPY6c', start: '2:40', end: '3:13', name: 'Старт зига ванвей'},
                    {id: 'cqGyahIPY6c', start: '3:18', end: '3:27', name: 'Зига -> КТ'},
                    {id: 'cqGyahIPY6c', start: '3:36', end: '3:50', name: 'X - KT'},
                    {id: 'cqGyahIPY6c', start: '4:05', end: '4:22', name: 'Из тёмки на ворота B'},
                    {id: 'cqGyahIPY6c', start: '4:31', end: '4:41', name: 'KT: Респа мид кросс'},
                    {id: 'cqGyahIPY6c', start: '4:50', end: '5:08', name: 'KT: В банку (машина -> бокс)'},
                    {id: 'cqGyahIPY6c', start: '5:22', end: '5:32', name: 'KT: Мидл -> B -> тёмка'},
                ]
            },
            {
                slug: 'de_mirage', name: 'Mirage',
                smokes: [
                    {id: 'cqGyahIPY6c', start: '5:45', end: '5:58', name: 'На старт (Т спавн -> мид)'},
                    {id: 'cqGyahIPY6c', start: '6:00', end: '6:11', name: 'В окно 128тик'},
                    {id: 'cqGyahIPY6c', start: '6:52', end: '7:04', name: 'На голову'},
                    {id: 'cqGyahIPY6c', start: '7:37', end: '7:54', name: 'Дым в хелпу'},
                    {id: 'cqGyahIPY6c', start: '', end: '', name: ''},
                    {id: 'cqGyahIPY6c', start: '', end: '', name: ''},
                ]
            },
            {
                slug: 'de_nuke', name: 'Nuke',
                smokes: [
                    {id: 'cqGyahIPY6c', start: '9:41', end: '7:57', name: 'на улицу ближний'},
                    {id: 'cqGyahIPY6c', start: '10:40', end: '10:57', name: 'В ангар'},
                    {id: 'cqGyahIPY6c', start: '11:12', end: '11:28', name: 'В маин с улицы'},
                ]
            },
            {
                slug: 'de_train', name: 'Train',
                smokes: [
                    {id: 'cqGyahIPY6c', start: '13:04', end: '13:15', name: 'Между'},
                    {id: 'cqGyahIPY6c', start: '13:17', end: '13:35', name: 'Электрик'},
                    {id: 'cqGyahIPY6c', start: '13:48', end: '13:55', name: 'T респ -> коннектор'},
                    {id: 'cqGyahIPY6c', start: '14:02', end: '14:21', name: 'Зелень c прохода на B'},
                    {id: 'cqGyahIPY6c', start: '14:35', end: '14:43', name: 'Левая часть зелени'},
                ]
            },
            {
                slug: 'de_overpass', name: 'Overpass',
                smokes: [
                    {id: 'cqGyahIPY6c', start: '15:00', end: '15:10', name: 'На девятку'},
                    {id: 'cqGyahIPY6c', start: '15:17', end: '15:32', name: 'Центр плента B'},
                    {id: 'cqGyahIPY6c', start: '15:34', end: '15:45', name: 'Хелпа A'},
                    {id: 'cqGyahIPY6c', start: '15:50', end: '16:08', name: 'Банк'},
                ]
            },
            {
                slug: 'de_inferno', name: 'Inferno',
                smokes: [
                    {id: 'cqGyahIPY6c', start: '17:17', end: '17:30', name: 'KT'},
                    {id: 'cqGyahIPY6c', start: '17:38', end: '17:48', name: 'Гробы'},
                    {id: 'cqGyahIPY6c', start: '17:53', end: '18:15', name: 'На лонг'},
                    {id: 'cqGyahIPY6c', start: '19:09', end: '19:17', name: 'На малые'},
                    {id: 'cqGyahIPY6c', start: '19:25', end: '19:45', name: 'Выход с ковров'},
                    {id: 'cqGyahIPY6c', start: '20:56', end: '21:11', name: 'KT: На занимание банана'},
                ]
            },
        ];

        // Чтобы на мобиле была альбомная ориентация
        try {
            var myScreenOrientation = window.screen.orientation;
            myScreenOrientation.lock("landscape");
        } catch (e) {
            console.log(e);
        }

        // В весь экран на смартфоне
        $('.btn-zoom-main').on('click', toggleFullScreen);
        function toggleFullScreen(e) {
            e.preventDefault();
            var doc = window.document;
            var docEl = doc.documentElement;

            var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
            var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

            if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                requestFullScreen.call(docEl);
            }
            else {
                cancelFullScreen.call(doc);
            }
        }

        // Выбор карты
        var $selectMap = $('.select-map select');
        var $topMenu = $('.top-menu');

        for (var k in maps) {
            $selectMap.append('<option value="' + maps[k].slug + '" ' + (!parseInt(k) ? 'selected="selected"' : "") + '>' + maps[k].name + '</option>');
        }

        // Подгрузка видео
        var currPlayerId = 'cqGyahIPY6c';
        setPlayer(currPlayerId, function (event) {
            event.target.playVideo();
        });

        // Плеер ютуба
        var player;
        var stopTimeout = null;
        var stopDuration = 0;
        var rewind = false;
        var seekTo = 0;
        function setPlayer(id, readyCallback) {
            if(stopTimeout !== null) {
                clearTimeout(stopTimeout);
                stopTimeout = null;
            }

            if(YT.loaded) {
                player = new YT.Player('video-player', {
                    //height: '360',
                    //width: '640',
                    videoId: id,
                    events: {
                        'onReady': readyCallback,
                        'onStateChange': onPlayerStateChange
                    }
                });
            } else {
                setTimeout(function () {
                    setPlayer(id, readyCallback);
                }, 500);
            }
        }

        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING) {
                if (rewind) {
                    rewind = false;
                    player.seekTo(seekTo);
                }

                if(stopTimeout !== null) {
                    clearTimeout(stopTimeout);
                    stopTimeout = null;
                }
                stopTimeout = setTimeout(pauseVideo, stopDuration);
            }
        }
        function pauseVideo() {
            stopTimeout = null;
            player.pauseVideo();
        }

        // Выбор карты
        onSelectMap(maps[0].slug);
        $selectMap.on('change', function () {
            onSelectMap($(this).val());
        });
        function onSelectMap(slug) {
            $topMenu.empty();
            for (var k in maps) {
                if(slug === maps[k].slug) {
                    for (var kSmoke in maps[k].smokes) {
                        $topMenu.append('<li class="top-menu__item"><a href="" class="top-menu__link" data-i-map="' + k + '" data-i-smoke="' + kSmoke + '">' + maps[k].smokes[kSmoke].name + '</a></li>');
                    }
                    break;
                }
            }
        }

        // Выбор раскидки
        $topMenu.on('click', ' .top-menu__link', function (e) {
            e.preventDefault();

            $('.top-menu__mob-burger').removeClass('_active');
            $('.top-menu-mob').slideUp(1);

            var iMap = parseInt($(this).attr('data-i-map'));
            var iSmoke = parseInt($(this).attr('data-i-smoke'));
            var smoke = maps[iMap].smokes[iSmoke];

            stopDuration = (__timeToSeconds(smoke.end) - __timeToSeconds(smoke.start)) * 1000;
            if(currPlayerId !== smoke.id) {
                setPlayer(smoke.id, function (event) {
                    seekTo = __timeToSeconds(smoke.start);
                    rewind = true;
                    player.playVideo();
                });
            } else {
                if(stopTimeout !== null) {
                    clearTimeout(stopTimeout);
                    stopTimeout = null;
                }
                seekTo = __timeToSeconds(smoke.start);
                rewind = false;
                player.seekTo(seekTo, true);
                player.playVideo();
            }
        });

        // Стилизация выподающего списка выбора карты
        $('.select-styler').styler();

        // Открытие/закрытие меню по клику на бургер
        $('.top-menu__mob-burger').click(function(e) {
            e.preventDefault();
            $('.top-menu__mob-burger').toggleClass('_active');
            $(this).find(' ~ .top-menu-mob').slideToggle(1);
        });

        // Закрытие меню по клику на свободную область
        $('body').click(function (e) {
            if( !$(e.target).closest(".top-menu__mob-burger, .top-menu-mob").length && $(window).width() <= 1024){
                $('.top-menu__mob-burger').removeClass('_active');
                $('.top-menu-mob').slideUp(1);
            }
        });
    });

    $('.btn-zoom').click(function(e) {
        e.preventDefault();
        if($('.btn-zoom').hasClass('_active')) {
            $('.btn-zoom, .btn-zoomx').removeClass('_active');
            $('.video-container').css({transform: 'scale(1)'});
        } else {
            $('.btn-zoom, .btn-zoomx').removeClass('_active');
            $('.btn-zoom').addClass('_active');
            $('.video-container').css({transform: 'scale(1.5)'});
        }
    });

    $('.btn-zoomx').click(function(e) {
        e.preventDefault();
        if($('.btn-zoomx').hasClass('_active')) {
            $('.btn-zoom, .btn-zoomx').removeClass('_active');
            $('.video-container').css({transform: 'scale(1)'});
        } else {
            $('.btn-zoom, .btn-zoomx').removeClass('_active');
            $('.btn-zoomx').addClass('_active');
            $('.video-container').css({transform: 'scale(1.5, 1.12)'});
        }
    });

    function __timeToSeconds(ms) {
        var a = ms.split(':');
        return (+a[0]) * 60 + (+a[1]);
    }
});

// Скрыть адресную строку на мобиле
/*
window.addEventListener("load",function() {
    setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 1);
});*/
