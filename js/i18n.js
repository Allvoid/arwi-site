/* ArWi site: English / Russian.
   The page and the builder are written in Russian; in English mode every Russian text node and the title, placeholder,
   aria-label and alt attributes are swapped for the English text from EN below (exact match on the trimmed text, or one
   of the PATTERNS). A MutationObserver does the same for everything the builder renders later, and the original Russian
   is remembered, so switching back to Russian restores it without a reload. English is the default. */
(() => {
'use strict';

const EN = {
  // nav, hero
  'ArWi — в начало': 'ArWi — back to top',
  'Что это': 'About',
  'Возможности': 'Features',
  'Лёгкость': 'Lightweight',
  'Собери стол': 'Build a desktop',
  'Темы': 'Themes',
  'Скоро в Steam · Windows 10 и 11': 'Coming to Steam · Windows 10 and 11',
  'Рабочий стол Windows,': 'Your Windows desktop,',
  'собранный под вас': 'built your way',
  'ArWi — приложение для кастомизации Windows. Свой бар вместо панели задач, панели виджетов, темы, живые обои и мини-папки. И всё это — почти без нагрузки на компьютер.':
    'ArWi is an app for customising Windows. Its own bar instead of the taskbar, widget panels, themes, live wallpapers and mini-folders. All of it with almost no load on your PC.',
  'Собрать свой стол': 'Build your desktop',
  'Следить за релизом': 'Follow the release',
  'Листать вниз': 'Scroll down',

  // about
  'Что такое ArWi': 'What ArWi is',
  'Два принципа, на которых всё держится': 'Two principles everything rests on',
  'Кастомизация без границ': 'Customisation without limits',
  'Бар, панели, виджеты, обои, шрифты, папки на столе, даже системные меню Windows — всё перекрашивается и перестраивается. Не «тёмная тема», а целый образ рабочего стола, который вы собираете сами.':
    'The bar, panels, widgets, wallpapers, fonts, desktop folders, even Windows system menus — everything can be recoloured and rearranged. Not a “dark mode”, but a whole look for your desktop that you put together yourself.',
  'Бережёт ресурсы': 'Light on resources',
  'ArWi работает всегда, поэтому не имеет права мешать. Своё нативное ядро вместо браузера внутри, сон, когда стол не виден, реакция на события вместо постоянных проверок. Игры и работа не замечают, что он запущен.':
    'ArWi is always running, so it has no right to get in the way. Its own native core instead of a browser inside, sleep when the desktop is hidden, reacting to events instead of constant checks. Your games and work won’t notice it is there.',
  'Обычная Windows': 'Plain Windows',
  'Панель задач одной формы и одного цвета': 'A taskbar with one shape and one colour',
  'Виджеты — в отдельном окне с новостями': 'Widgets live in a separate window full of news',
  'Поиск теряется, если раскладка не та': 'Search gets lost if the keyboard layout is wrong',
  'Окна двигаются без магнита и инерции': 'Windows move without magnet or inertia',
  'Обои — картинка, и только': 'A wallpaper is just a picture',
  'С ArWi': 'With ArWi',
  'Бар любой формы, длины, цвета и с любого края': 'A bar of any shape, length and colour, on any edge',
  'Свои панели виджетов прямо на рабочем столе': 'Your own widget panels right on the desktop',
  'Набрали «сДшщт» — найдёт CLion': 'Typed “сДшщт” in the Russian layout? It still finds CLion',
  'Окна прилипают к краям и доезжают по инерции': 'Windows snap to edges and glide on with inertia',
  'Живые обои у каждой темы, без нагрузки': 'Live wallpapers for every theme, without the load',

  // features
  'Красивее — и удобнее, чем было': 'Better looking — and easier to use',
  'ArWi не просто меняет вид. Он добавляет то, чего в Windows не хватало годами.': 'ArWi doesn’t just change the look. It adds what Windows has been missing for years.',
  'наведите на значки': 'hover over the icons',
  'Свой бар вместо панели задач': 'Its own bar instead of the taskbar',
  'Шесть видов полосы — ArWi, Windows 11, Windows 10, Waybar, Dock и с подписями. Любой край экрана, длина, толщина, скругление, цвет или градиент до 8 цветов. Значки растут волной под курсором, как в доке macOS, а под развёрнутым окном бар прячется и выезжает с лёгкой инерцией.':
    'Six bar looks — ArWi, Windows 11, Windows 10, Waybar, Dock and labelled. Any screen edge, length, thickness, rounding, a colour or a gradient of up to 8 colours. Icons swell in a wave under the cursor like the macOS dock, and under a maximised window the bar hides and slides back out with a light bounce.',
  'Наведите на номер стола — увидите, какие приложения на нём открыты': 'Hover over a desktop number to see which apps are open on it',
  'Перетащите окно прямо на номер другого стола': 'Drag a window straight onto another desktop’s number',
  'Живой трей с настоящими меню приложений': 'A live tray with the apps’ real menus',
  'Панели виджетов': 'Widget panels',
  'Погода, заметки, плеер, календарь, помодоро, монитор ресурсов, валюты, GitHub, Discord, чек-лист, быстрые вставки текста. Включайте нужные, выключайте лишние, ставьте панель к любому краю. Заметку можно оторвать прямо на стол.':
    'Weather, notes, media player, calendar, pomodoro, resource monitor, currencies, GitHub, Discord, a checklist, quick text snippets. Turn on what you need, turn off the rest, put the panel on any edge. A note can be torn off right onto the desktop.',
  'Поиск, который понимает': 'Search that gets you',
  'Win-панель и поиск в пяти стилях. Забыли переключить раскладку? ArWi ищет сразу на всех языках: «ашкуащч» найдёт Firefox. Новые программы появляются в поиске сами, без перезапуска.':
    'The Win panel and search in five styles. Forgot to switch your keyboard layout? ArWi searches in all your languages at once: “ашкуащч” still finds Firefox. New programs show up in search on their own, no restart needed.',
  'Мини-папки на столе': 'Mini-folders on the desktop',
  'Компактные папки с ярлыками прямо на рабочем столе. Круг, капсула, шестиугольник, срезанные углы — и своё оформление под каждую тему. Выделение как в Проводнике.':
    'Compact folders of shortcuts right on the desktop. Circle, capsule, hexagon, cut corners — and a look of their own for every theme. Selection works just like in File Explorer.',
  'Окна с физикой': 'Windows with physics',
  'Окна прилипают к краям и друг к другу, отпущенное окно мягко доезжает по инерции. Цветная скруглённая рамка вокруг окон — под цвет темы.':
    'Windows snap to the screen edges and to each other, and a released window glides on softly. A rounded coloured border around windows matches your theme.',
  'Живые обои': 'Live wallpapers',
  'У каждой темы — свои обои, статичные и живые. Видео декодирует видеокарта, частоту кадров можно ограничить, а под игрой обои сами встают на паузу.':
    'Every theme has its own wallpapers, static and live. The video is decoded by the graphics card, the frame rate can be capped, and under a game the wallpaper pauses by itself.',
  'Меню Windows в вашем стиле': 'Windows menus in your style',
  'Контекстные меню Проводника, Блокнота и других классических программ перекрашиваются в цвета темы — любой цвет фона, текста и подсветки.':
    'Context menus in File Explorer, Notepad and other classic programs take on your theme’s colours — any background, text and highlight colour.',

  // lightness
  'Оптимизация': 'Optimisation',
  'Красиво — и при этом легко': 'Beautiful — and still lightweight',
  'Приложение, которое работает постоянно, обязано быть незаметным. Поэтому в ArWi нет самой прожорливой вещи, какая только бывает у красивых оболочек, — браузера внутри.':
    'An app that is always running has to stay out of sight. That is why ArWi has none of the hungriest thing a pretty shell can carry — a browser inside.',
  'WebView и Electron.': 'WebView or Electron.',
  'Интерфейс рисует своё нативное ядро на C++ и Direct3D': 'The interface is drawn by its own native core in C++ and Direct3D',
  'процессора в простое': 'CPU when idle',
  '(замер на ПК разработчика)': '(measured on the developer’s PC)',
  'постоянных проверок в покое: о новых окнах ArWi узнаёт от самой Windows': 'constant checks when idle: Windows itself tells ArWi about new windows',
  'Мы проверили веб на себе': 'We tried the web ourselves',
  'Первая версия ArWi рисовала интерфейс встроенным браузером — так делают многие. Он ел память и процессор и тормозил всё вокруг. Поэтому ArWi переписан целиком на собственном нативном ядре: каждое окно, панель и виджет рисуются напрямую видеокартой.':
    'The first version of ArWi drew its interface with a built-in browser — many apps do. It ate memory and CPU and slowed everything around it. So ArWi was rewritten from scratch on its own native core: every window, panel and widget is drawn directly by the graphics card.',
  'Встроенный браузер (WebView)': 'Built-in browser (WebView)',
  'Нативное ядро ArWi': 'ArWi native core',
  'Схема: сколько слоёв стоит между вашим кликом и картинкой': 'Diagram: how many layers sit between your click and the picture',
  'Спит, когда его не видно.': 'Sleeps when you can’t see it.',
  'Под игрой или развёрнутым окном панели засыпают, видео-обои встают на паузу. Погас экран или заблокирован компьютер — останавливаются и фоновые обновления.':
    'Under a game or a maximised window the panels go to sleep and video wallpapers pause. When the screen turns off or the PC is locked, background updates stop too.',
  'События вместо опросов.': 'Events instead of polling.',
  'Открыли окно, переключили стол, поставили программу — Windows сама сообщает об этом ArWi. Никаких таймеров «раз в секунду».':
    'Opened a window, switched desktops, installed a program — Windows tells ArWi itself. No “once a second” timers.',
  'Энергоэффективный режим.': 'Power-efficient mode.',
  'Процессы ArWi помечены для Windows как фоновые и работают на экономичных ядрах. На батарее обои снижают частоту кадров.':
    'ArWi processes are marked as background work, so Windows runs them on its efficient cores. On battery the wallpaper lowers its frame rate.',
  'Не лезет в игры.': 'Stays out of games.',
  'В игры, античиты и программы из Store модули ArWi не загружаются вовсе — ввод в игре не страдает.':
    'ArWi modules are never loaded into games, anti-cheats or Store apps — your in-game input is untouched.',
  'Энергосбережение по пунктам.': 'Power saving, point by point.',
  'Заморозить анимации, реже обновлять виджеты, отключить фоновые превью — выбираете сами, чем пожертвовать.':
    'Freeze animations, update widgets less often, turn off background previews — you choose what to give up.',

  // builder section
  'Конструктор': 'Builder',
  'Соберите свой рабочий стол': 'Build your own desktop',
  'Упрощённый макет, но с настоящими темами, обоями и анимациями ArWi. Щёлкайте по бару, логотипу и лупе, таскайте окна, наводите на значки.':
    'A simplified mock-up, but with ArWi’s real themes, wallpapers and animations. Click the bar, the logo and the magnifier, drag windows around, hover over the icons.',
  'Здесь вы можете примерно посмотреть, какие рабочие столы можно собрать. Это упрощённый макет, и настройки здесь урезаны до основных. Настоящей кастомизации в ArWi намного больше: почти всё, что вы видите здесь (цвета, скругление, все модули, обои), можно выключить, настроить и поменять.':
    'Here you can get a rough idea of which desktops you can put together. This is a simplified mock-up, and the settings here are cut down to the basics. ArWi’s real customisation goes much further: almost everything you see here (colours, corner rounding, every module, the wallpaper) can be turned off, configured and changed.',
  'На телефоне макет мелкий: приблизьте его пальцами или откройте сайт на компьютере.': 'On a phone the mock-up is small: pinch to zoom or open the site on a computer.',
  'Развернуть окно': 'Maximise window',
  'Вернуть окно': 'Restore window',
  'Случайный стол': 'Random desktop',
  'Сбросить': 'Reset',
  'Ссылка на мою сборку': 'Link to my build',
  'Тема': 'Theme', 'Бар': 'Bar', 'Виджеты': 'Widgets', 'Обои': 'Wallpaper', 'Ещё': 'More',

  // themes (names and descriptions from ArWi)
  'Морозная северная палитра, матовое стекло, холодный frost': 'A frosty northern palette, matte glass, cold frost',
  'Алый': 'Scarlet',
  'Чёрно-алый шёлк: глубокий багрянец, тёмные панели, яркий красный акцент': 'Black and scarlet silk: deep crimson, dark panels, a bright red accent',
  'Лайм': 'Lime',
  'Тёмная зелень и сочный лайм: мягкие скругления, светлые рамки, градиентные полосы': 'Dark greens and juicy lime: soft corners, light borders, gradient bars',
  'Пиксель · Янтарь': 'Pixel · Amber',
  'Ретро-пиксельный фон в тёплом янтарном моноцвете': 'A retro pixel backdrop in warm amber monochrome',
  'TUI-эстетика: btop / cava. Моно-шрифт, боксы, квадратные углы': 'TUI style: btop / cava. Mono font, boxes, square corners',
  'Мягкие пастельные тона, крупные скругления, уютное стекло': 'Soft pastels, big rounded corners, cosy glass',
  'Глубокий индиго с неоновым свечением акцентов': 'Deep indigo with neon-glowing accents',
  'Светлая тёплая бумага, приглушённые роза/ирис/сосна': 'Light warm paper, muted rose, iris and pine',
  'Тёплая бумага, чёрные 2px рамки, твёрдые тени, один кричащий акцент': 'Warm paper, black 2px borders, hard shadows, one loud accent',
  'Хвойная ночь': 'Pine Night',
  'Тёмная тема с зелёным акцентом: прямые углы, жёсткие тени, градиентные полосы': 'A dark theme with a green accent: square corners, hard shadows, gradient bars',
  'Ночной город': 'Night City',
  'Тёмная тема с бирюзовым акцентом: крупные скругления, жёсткие тени, градиентные полосы': 'A dark theme with a turquoise accent: big rounded corners, hard shadows, gradient bars',
  'Рассвет': 'Dawn',
  'Светлая тема с синим акцентом: крупные скругления, свечение вместо теней, неоновые полосы': 'A light theme with a blue accent: big rounded corners, glow instead of shadows, neon bars',
  'Бумага и тушь': 'Paper & Ink',
  'Светлая тема с оранжевым акцентом: прямые углы, жёсткие тени, градиентные полосы': 'A light theme with an orange accent: square corners, hard shadows, gradient bars',

  // builder controls
  'Встроенные темы': 'Built-in themes', '13 штук': '13 of them',
  'Акцент': 'Accent', 'Акцент темы': 'Theme accent', 'Свой цвет': 'Your own colour', 'Свой цвет акцента': 'Your own accent colour',
  'Встроенные темы в ArWi не испортить: любая правка создаёт вашу копию темы — «Настроить под себя».': 'You can’t spoil a built-in theme in ArWi: any change makes your own copy of it — “Make it mine”.',
  'Сейчас это': 'This is now',
  '. В ArWi её можно сохранить, экспортировать в файл и поделиться.': '. In ArWi you can save it, export it to a file and share it.',
  'Скругление карточек': 'Card rounding', 'Плотность карточек': 'Card opacity',
  'Тень': 'Shadow', 'Нет': 'None', 'Мягкая': 'Soft', 'Жёсткая': 'Hard', 'Свечение': 'Glow',
  'Заголовки карточек': 'Card titles', 'Обычные': 'Regular', 'Моно [ TUI ]': 'Mono [ TUI ]', 'КАПС': 'CAPS',
  'Показывать бар': 'Show the bar', 'вместо панели задач Windows': 'instead of the Windows taskbar',
  'Вид полосы': 'Bar look', 'С подписью': 'Labelled',
  'Край экрана': 'Screen edge', 'Снизу': 'Bottom', 'Сверху': 'Top', 'Слева': 'Left', 'Справа': 'Right',
  'Длина': 'Length', 'Толщина': 'Thickness', 'Скругление': 'Rounding', 'Прозрачность': 'Transparency',
  'Цвет бара': 'Bar colour', 'Как акцент темы': 'Same as theme accent',
  'Градиент': 'Gradient', 'из цветов темы': 'from the theme colours',
  'Dock-анимация значков': 'Dock icon animation', 'значок под курсором растёт волной': 'the icon under the cursor swells in a wave',
  'Пиковый масштаб': 'Peak size',
  'Пиковый масштаб. В ArWi значки могут вырасти до 500% и выйти за пределы бара.': 'Peak size. In ArWi icons can grow up to 500% and spill out of the bar.',
  'Под развёрнутым окном': 'Under a maximised window', 'Ничего': 'Stay', 'Полоска': 'Strip', 'Скрывать': 'Hide',
  'Нажмите «Развернуть окно» под макетом и подведите мышь к краю — бар выедет с лёгкой инерцией.': 'Press “Maximise window” below the mock-up and move the mouse to the edge — the bar slides out with a light bounce.',
  'Анимация всплывающих окон': 'Popup animation', 'Масштаб': 'Scale', 'Выезд': 'Slide', 'Проявление': 'Fade', 'Без': 'None',
  'Длительность': 'Duration',
  'Одна анимация на Win-панель, поиск, превью окон и столов. Щёлкните логотип или лупу на баре.': 'One animation for the Win panel, search, window and desktop previews. Click the logo or the magnifier on the bar.',
  'Панель виджетов': 'Widget panel', 'Большие часы на столе': 'Big clock on the desktop',
  'Виджеты на панели': 'Widgets on the panel', 'щёлкните, чтобы включить': 'click to turn on',
  'В ArWi есть ещё GitHub, Discord, статусы сайтов, калькулятор, Bash-заготовки и запуск приложений.': 'ArWi also has GitHub, Discord, website status, a calculator, Bash snippets and an app launcher.',
  'Край': 'Edge', 'Скрытие панели': 'Panel hiding', 'Всегда видна': 'Always shown',
  'В режимах «Полоска» и «Скрывать» панель выезжает, когда мышь у края экрана. Стрелка сбоку сворачивает её целиком.': 'In “Strip” and “Hide” the panel slides out when the mouse reaches the screen edge. The arrow on its side folds it away completely.',
  'Источник': 'Source', 'Обои темы': 'Theme wallpaper', 'Галерея': 'Gallery', 'Свой файл': 'Your file', 'обои встроенных тем': 'wallpapers of the built-in themes',
  'видео-версия обоев, где она есть': 'the video version, where there is one',
  'У этих обоев есть живая версия: видео декодирует видеокарта, под игрой оно встаёт на паузу.': 'This wallpaper has a live version: the graphics card decodes the video, and it pauses under a game.',
  'У этих обоев нет живой версии — выберите Nord, Пиксель, Catppuccin, Tokyo, Gruvbox, Rosé Pine или Brutalist.': 'This wallpaper has no live version — pick Nord, Pixel, Catppuccin, Tokyo, Gruvbox, Rosé Pine or Brutalist.',
  'Загрузить свою картинку': 'Upload your own picture',
  'Картинка остаётся только в этой вкладке браузера и никуда не отправляется.': 'The picture stays in this browser tab only and is not sent anywhere.',
  'щёлкните папку на макете': 'click a folder on the mock-up', 'Форма плитки': 'Tile shape',
  'Скруглённая': 'Rounded', 'Круг': 'Circle', 'Капсула': 'Capsule', 'Шестиугольник': 'Hexagon', 'Срезанные углы': 'Cut corners',
  'Окна': 'Windows', 'Магнит': 'Magnet', 'окна прилипают к краям и друг к другу': 'windows snap to edges and to each other',
  'Дистанция притягивания': 'Snap distance', 'Инерция': 'Inertia', 'брошенное окно доезжает и тормозит': 'a thrown window glides on and slows down',
  'Цветная рамка окон': 'Coloured window border', 'цвет акцента темы': 'in the theme accent colour',
  'Рабочие столы': 'Desktops',
  'Наведите на номер стола на баре — появится список его окон. Переключение мгновенное, без анимации. Окно можно перетащить прямо на номер другого стола.':
    'Hover over a desktop number on the bar to see its windows. Switching is instant, with no animation. A window can be dragged right onto another desktop’s number.',

  // mock desktop
  'Игры': 'Games', 'Работа': 'Work', 'Медиа': 'Media',
  'Погода': 'Weather', 'Облачно': 'Cloudy', 'Влажность 81% · ветер 3 м/с': 'Humidity 81% · wind 3 m/s', 'Восход 08:02 · закат 16:24': 'Sunrise 08:02 · sunset 16:24',
  'Заметка': 'Note', 'Купить молоко': 'Buy milk', 'Проверить сервер': 'Check the server', 'Позвонить дизайнеру': 'Call the designer',
  'Плеер': 'Player', 'Ресурсы ArWi': 'ArWi resources', 'Ресурсы': 'Resources', 'Помодоро': 'Pomodoro', 'Старт': 'Start', 'Пауза': 'Pause', 'Стоп': 'Stop',
  'Календарь': 'Calendar', 'Пн': 'Mo', 'Вт': 'Tu', 'Ср': 'We', 'Чт': 'Th', 'Пт': 'Fr', 'Сб': 'Sa', 'Вс': 'Su',
  'Валюты': 'Currencies', 'Быстрые вставки': 'Quick snippets', 'Приветствие': 'Greeting', 'Привет!': 'Hi!', 'Спасибо': 'Thanks', 'Спасибо!': 'Thank you!',
  'Чек-лист': 'Checklist', 'Обновить драйверы': 'Update drivers', 'Подписаться на канал': 'Join the channel', 'Секундомер': 'Stopwatch',
  'Пусто': 'Empty', 'Включите виджеты в настройках справа': 'Turn widgets on in the settings',
  'Свернуть панель': 'Fold the panel',
  'Заметки.txt — Блокнот': 'Notes.txt — Notepad', 'Файл': 'File', 'Правка': 'Edit', 'Вид': 'View',
  'Перетащите это окно за заголовок.': 'Drag this window by its title bar.',
  'Оно прилипнет к краю экрана и к другим окнам, а если бросить его в движении — доедет по инерции.': 'It snaps to the screen edge and to other windows, and if you let go while moving it glides on by inertia.',
  'Бросьте окно на номер стола на баре, чтобы перенести его на другой стол.': 'Drop the window on a desktop number on the bar to move it to another desktop.',
  'Калькулятор': 'Calculator', 'Проводник': 'File Explorer', 'Блокнот': 'Notepad', 'Музыка': 'Music', 'Терминал': 'Terminal',
  'Параметры': 'Settings', 'Диспетчер задач': 'Task Manager', 'Командная строка': 'Command Prompt', 'Диспетчер': 'Task', 'Командная': 'Command',
  'Win-панель': 'Win panel', 'Поиск · Win+S': 'Search · Win+S', 'Поиск': 'Search', 'Показать рабочий стол': 'Show desktop',
  'Скрытые значки': 'Hidden icons', 'Язык ввода': 'Input language', 'Сеть': 'Network', 'Громкость: 60%': 'Volume: 60%',
  'Поиск приложений': 'Search apps', 'Закреплённые виджеты · Win': 'Pinned widgets · Win', 'Питание': 'Power',
  'Недавние приложения ниже. Попробуйте набрать название в неправильной раскладке:': 'Recent apps are below. Try a name typed in the wrong keyboard layout (Russian):',
  'или': 'or',
  'Открыть': 'Open', 'От администратора': 'Run as administrator', 'Открыть расположение': 'Open file location', 'Закрепить на баре': 'Pin to the bar', 'Удалить': 'Uninstall',
  'найдено по другой раскладке': 'found through the other layout', 'Приложение': 'App', 'Ничего не нашлось': 'Nothing found',
  'Пусто — окон нет': 'Empty — no windows', 'Закреплено · щёлкните, чтобы запустить': 'Pinned · click to launch',

  // toasts
  'В ArWi «+» создаёт новый рабочий стол': 'In ArWi “+” creates a new desktop',
  'Щелчок по часам открывает календарь': 'Clicking the clock opens the calendar',
  'Скопировано в буфер': 'Copied to the clipboard',
  'Здесь меню питания: сон, перезагрузка, выключение': 'This is the power menu: sleep, restart, shut down',
  'Действие с приложением': 'App action',
  'На этом столе нет окон — откройте Блокнот с бара': 'No windows on this desktop — open Notepad from the bar',
  'Подведите мышь к краю экрана — бар выедет': 'Move the mouse to the screen edge — the bar slides out',
  'Сборка сброшена': 'Build reset',
  'Ссылка на сборку скопирована': 'Link to your build copied',
  'Ссылка на сборку — в адресной строке': 'The link to your build is in the address bar',

  // themes section
  '13 встроенных тем — и это верхушка айсберга': '13 built-in themes — and that’s the tip of the iceberg',
  'Тема в ArWi — это целый образ: палитра, стиль карточек, обои, логотип и форма бара, оформление папок и даже системных меню. Сменили тему — сменился весь стол. Нажмите на любую, чтобы примерить её в конструкторе.':
    'A theme in ArWi is a whole look: palette, card style, wallpaper, the bar’s logo and shape, folder styling and even system menus. Change the theme and the whole desktop changes. Click any of them to try it in the builder.',
  'Вживую': 'Live',
  'Это не макет: все 13 тем подряд на настоящем рабочем столе с ArWi. Бар, обои и мини-папки меняются вместе с темой.': 'Not a mock-up: all 13 themes in a row on a real desktop running ArWi. The bar, wallpaper and mini-folders change with the theme.',
  'Настройте под себя': 'Make it yours',
  'Любую тему можно скопировать в свою одной кнопкой и крутить дальше:': 'Any theme can be copied into your own with one button and tweaked further:',
  'цвета, градиенты, прозрачность панелей': 'colours, gradients, panel transparency',
  'скругления, рамки, тени — мягкая, жёсткая, свечение, кольцо, блик': 'rounding, borders, shadows — soft, hard, glow, ring, sheen',
  'вид заголовков, кнопок и полос прогресса': 'the look of titles, buttons and progress bars',
  'шрифт, логотип бара, оформление мини-папок': 'font, bar logo, mini-folder styling',
  'миксер: карточки из одной темы, бар из другой': 'a mixer: cards from one theme, the bar from another',
  'Темы, которые живут': 'Themes that live',
  'Тема может сама меняться по обстоятельствам: темнеть к ночи по реальному закату, менять обои в дождь, реагировать на сезон или заряд батареи. Краски переезжают плавно, без мигания.':
    'A theme can change by itself: get darker at night following the real sunset, switch wallpaper when it rains, react to the season or the battery level. Colours shift smoothly, without flicker.',
  'Тему можно сохранить в один файл': 'A theme can be saved as a single',
  '— с обоями и даже видео внутри — и поделиться ею. Двойной щелчок по файлу ставит тему.': 'file — with the wallpaper and even video inside — and shared. Double-clicking the file installs the theme.',
  'В работе': 'In the works',
  'Тема, написанная кодом': 'A theme written in code',
  'Уже сейчас тема может нести свой стилевой лист поверх оформления. А разработчик работает над тем, чтобы тему можно было': 'Even now a theme can carry its own style sheet on top of the design. And the developer is working on letting you',
  'буквально написать кодом': 'literally write a theme in code',
  '— не только менять готовые настройки, а перестроить окна, анимации и поведение почти до неузнаваемости. Для тех, кому мало ползунков.':
    '— not just change ready-made settings, but rebuild windows, animations and behaviour almost beyond recognition. For those who find sliders too few.',
  'моя-тема.rcss': 'my-theme.rcss',
  '/* бар без скруглений, с градиентом */': '/* square bar with a gradient */',
  '/* круглые значки, которые пляшут */': '/* round icons that dance */',
  '/* неоновые часы */': '/* neon clock */',

  // telegram, footer
  'Telegram-канал': 'Telegram channel',
  'Следите за ArWi': 'Follow ArWi',
  'Новости, ролики и скриншоты новых функций выходят сначала в канале. Там же объявим выход в Steam. Пишите в комментариях, что хотите увидеть в ArWi, — разработчик их читает и часто отвечает.':
    'News, videos and screenshots of new features appear in the channel first. That is also where we’ll announce the Steam release. Tell us in the comments what you’d like to see in ArWi — the developer reads them and often replies. The channel is in Russian.',
  'QR-код канала t.me/ArWiApp': 'QR code of the channel t.me/ArWiApp',
  'Наведите камеру телефона': 'Point your phone camera here',
  'Приложение для кастомизации Windows 10 и 11. Скоро в Steam.': 'An app for customising Windows 10 and 11. Coming to Steam.',

  // page meta
  'ArWi — рабочий стол Windows, собранный под вас': 'ArWi — your Windows desktop, built your way',
  'ArWi — приложение для кастомизации Windows: свой бар, панели виджетов, темы, обои и мини-папки. Нативное ядро без WebView — красиво и легко для системы.':
    'ArWi is an app for customising Windows: its own bar, widget panels, themes, wallpapers and mini-folders. A native core with no WebView — beautiful and light on your system.',
};

// texts built from parts: [pattern, function returning the English text]
const PATTERNS = [
  [/^Акцент (#\w+)$/, m => `Accent ${m[1]}`],
  [/^Цвет бара (#\w+)$/, m => `Bar colour ${m[1]}`],
  [/^Обои ([\w-]+)$/, m => `Wallpaper ${m[1]}`],
  [/^(\d+) мс$/, m => `${m[1]} ms`],
  [/^Рабочий стол (\d+)$/, m => `Desktop ${m[1]}`],
  [/^(.+) · стол (\d+)$/, m => `${toEn(m[1])} · desktop ${m[2]}`],
  [/^Запуск: (.+)$/, m => `Launching: ${toEn(m[1])}`],
  [/^Окно на столе (\d+) — переключились туда$/, m => `The window is on desktop ${m[1]} — switched there`],
  [/^Окно перенесено на стол (\d+)$/, m => `Window moved to desktop ${m[1]}`],
  [/^своя тема на основе «(.+)»$/, m => `a custom theme based on “${toEn(m[1])}”`],
];
const CYR = /[А-Яа-яЁё]/;
function toEn(s) {
  if (s in EN) return EN[s];
  for (const [re, fn] of PATTERNS) { const m = s.match(re); if (m) return fn(m); }
  return s;
}

let LANG = 'en';
try { const saved = localStorage.getItem('arwi-lang'); if (saved === 'ru' || saved === 'en') LANG = saved; } catch (e) { /* storage may be off */ }

const textOrig = new WeakMap();   // text node -> Russian text
const attrOrig = new WeakMap();   // element -> { attr: Russian value }
const ATTRS = ['title', 'placeholder', 'aria-label', 'alt'];

function swapText(node) {
  const raw = node.nodeValue;
  if (LANG === 'en') {
    if (!CYR.test(raw)) return;
    const t = raw.trim();
    const en = toEn(t);
    if (en === t) return;
    textOrig.set(node, raw);
    node.nodeValue = raw.replace(t, en);
  } else if (textOrig.has(node)) {
    node.nodeValue = textOrig.get(node);
    textOrig.delete(node);
  }
}
function swapAttrs(el) {
  for (const a of ATTRS) {
    const v = el.getAttribute(a);
    if (v == null) continue;
    if (LANG === 'en') {
      if (!CYR.test(v)) continue;
      const en = toEn(v.trim());
      if (en === v.trim()) continue;
      const o = attrOrig.get(el) || {}; o[a] = v; attrOrig.set(el, o);
      el.setAttribute(a, en);
    } else {
      const o = attrOrig.get(el);
      if (o && a in o) el.setAttribute(a, o[a]);
    }
  }
}
function walk(root) {
  if (root.nodeType === 3) { swapText(root); return; }
  if (root.nodeType !== 1 || root.closest('script,style')) return;
  swapAttrs(root);
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode: n => n.nodeType === 1 && (n.tagName === 'SCRIPT' || n.tagName === 'STYLE') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  let n;
  while ((n = w.nextNode())) n.nodeType === 3 ? swapText(n) : swapAttrs(n);
}

let busy = false;
const mo = new MutationObserver(list => {
  if (busy || LANG !== 'en') return;
  busy = true;
  for (const m of list) {
    if (m.type === 'childList') m.addedNodes.forEach(walk);
    else if (m.type === 'characterData') swapText(m.target);
  }
  busy = false;
});

const META_RU = { title: document.title, desc: document.querySelector('meta[name=description]')?.content };
function applyMeta() {
  document.documentElement.lang = LANG;
  document.title = LANG === 'en' ? toEn(META_RU.title) : META_RU.title;
  const d = document.querySelector('meta[name=description]');
  if (d) d.content = LANG === 'en' ? toEn(META_RU.desc) : META_RU.desc;
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === LANG));
  const ink = document.querySelector('.lang .lang-ink');
  const on = document.querySelector('.lang button.on');
  if (ink && on) { ink.style.width = on.offsetWidth + 'px'; ink.style.transform = `translateX(${on.offsetLeft - 3}px)`; }
}
function setLang(lang) {
  if (lang === LANG) return;
  LANG = lang;
  try { localStorage.setItem('arwi-lang', lang); } catch (e) { /* storage may be off */ }
  busy = true;
  walk(document.body);
  busy = false;
  applyMeta();
  document.dispatchEvent(new CustomEvent('arwi:lang', { detail: lang }));
}

window.ARWI_LANG = () => LANG;
window.tr = s => (LANG === 'en' ? toEn(s) : s);   // for code that needs the text itself (search, typed code)

document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
if (LANG === 'en') { busy = true; walk(document.body); busy = false; }
applyMeta();
mo.observe(document.body, { childList: true, subtree: true, characterData: true });
document.documentElement.classList.remove('i18n-wait');
addEventListener('load', applyMeta);
document.fonts?.ready.then(applyMeta);
})();
