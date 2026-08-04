/* ==========================================================
   Decap CMS プレビューテンプレート集
   hyperscript(h) + createClass のみで書かれています（ビルド不要）。
   対象外（登録なし・標準プレビューのまま）: site / navigation / related-links / news-page
   ========================================================== */
(function () {
  var h = window.h || (window.CMS && window.CMS.h);
  var createClass = window.createClass || (window.CMS && window.CMS.createClass);

  if (!h || !createClass) {
    console.error(
      '[preview] h / createClass が見つかりません。window.CMS を確認してください。',
      window.CMS,
    );
    return;
  }

  // ---------- 共通ヘルパー ----------
  function toJS(v) {
    return v && typeof v.toJS === 'function' ? v.toJS() : v;
  }
  function arr(v) {
    if (!v) return [];
    return typeof v.toArray === 'function' ? v.toArray() : v;
  }
  function get(map, key, fallback) {
    if (!map) return fallback;
    var val = typeof map.get === 'function' ? map.get(key) : map[key];
    return val === undefined || val === null ? fallback : val;
  }

  var COLOR = {
    ink: '#1E1C1A',
    inkSoft: '#55524C',
    inkFaint: '#8A8781',
    indigo: '#29415C',
    indigoDeep: '#16283A',
    bengara: '#A24730',
    line: '#D8D7D2',
    panel: '#FAFAFA',
  };

  // ★追加: このAstroサイトのbase path（astro.config側のbase設定と合わせる）
  // public_folder は base を含まない値のままにしておき、プレビュー表示専用にここで補う。
  var BASE_PATH = '/hotel-grand-toya';

  function Eyebrow(icon, eyebrow, heading) {
    return h(
      'div',
      { style: { marginBottom: '20px' } },
      h(
        'p',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.74rem',
            fontWeight: 500,
            letterSpacing: '0.14em',
            color: COLOR.indigo,
            marginBottom: '10px',
          },
        },
        h(
          'span',
          {
            style: {
              display: 'inline-flex',
              height: '24px',
              width: '24px',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1.5px solid ' + COLOR.bengara,
              borderRadius: '1px',
              transform: 'rotate(-3deg)',
              fontFamily: 'var(--font-serif)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: COLOR.bengara,
            },
          },
          icon,
        ),
        eyebrow,
      ),
      h(
        'h2',
        {
          style: {
            fontFamily: 'var(--font-serif)',
            fontSize: '1.35rem',
            fontWeight: 600,
            color: COLOR.ink,
          },
        },
        heading,
      ),
    );
  }

  function Lines(list, style) {
    var a = toJS(list) || [];
    return h(
      'div',
      { style: style || {} },
      a.map(function (line, i) {
        return h(
          'p',
          {
            key: i,
            style: {
              marginBottom: '8px',
              color: COLOR.inkSoft,
              fontSize: '0.9rem',
              lineHeight: 1.85,
            },
          },
          line,
        );
      }),
    );
  }

  // ★修正: public_folder が base path を含まないため、プレビュー表示時にここで補う
  function ImgTag(getAsset, src, alt, style) {
    if (!src) return null;
    var resolved = src;
    try {
      var asset = getAsset(src);
      if (asset) resolved = asset.toString();
    } catch (e) {}
    if (
      resolved &&
      resolved.indexOf('http') !== 0 &&
      resolved.indexOf('data:') !== 0 &&
      resolved.indexOf('blob:') !== 0 &&
      resolved.indexOf(BASE_PATH) !== 0
    ) {
      resolved = BASE_PATH + resolved;
    }
    return h('img', {
      src: resolved,
      alt: alt || '',
      style: Object.assign(
        { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
        style || {},
      ),
    });
  }

  function PageTitle(title, titleEn) {
    return h(
      'div',
      {
        style: {
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '2px solid ' + COLOR.bengara,
        },
      },
      h(
        'p',
        {
          style: {
            fontSize: '0.74rem',
            letterSpacing: '0.18em',
            color: COLOR.inkFaint,
            marginBottom: '6px',
          },
        },
        titleEn,
      ),
      h(
        'h1',
        {
          style: {
            fontFamily: 'var(--font-serif)',
            fontSize: '1.7rem',
            fontWeight: 600,
            color: COLOR.ink,
          },
        },
        title,
      ),
    );
  }

  // ★追加: ページ内アンカーナビのプレビュー表示（複数コレクションで共通利用）
  function QuickNavBadges(quickNav) {
    var items = arr(quickNav);
    if (items.length === 0) return null;
    return h(
      'div',
      { style: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' } },
      items.map(function (item, i) {
        return h(
          'span',
          {
            key: i,
            style: {
              fontSize: '0.76rem',
              border: '1px solid ' + COLOR.line,
              borderRadius: '20px',
              padding: '4px 12px',
              color: COLOR.ink,
            },
          },
          get(item, 'label'),
        );
      }),
    );
  }

  function LabelValueRow(label, value, key) {
    return h(
      'div',
      {
        key: key,
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          gap: '12px',
          borderTop: '1px solid ' + COLOR.line,
          padding: '8px 0',
          fontSize: '0.86rem',
        },
      },
      h('span', { style: { color: COLOR.inkFaint } }, label),
      h('span', { style: { color: COLOR.ink, textAlign: 'right' } }, value),
    );
  }

  function Card(children, opts) {
    opts = opts || {};
    var props = {
      style: Object.assign(
        {
          border: '1px solid ' + COLOR.line,
          background: '#fff',
          padding: '18px',
          marginBottom: '16px',
        },
        opts.style || {},
      ),
    };
    if (opts.key !== undefined) props.key = opts.key;
    return h('div', props, children);
  }

  // 複数の子要素を可変長引数でそのまま h() に渡す
  function Wrapper() {
    var children = Array.prototype.slice.call(arguments);
    return h.apply(
      null,
      [
        'div',
        {
          style: {
            maxWidth: '900px',
            margin: '0 auto',
            padding: '32px 20px',
            fontFamily: 'var(--font-sans)',
          },
        },
      ].concat(children),
    );
  }

  // ---------- hero ----------
  CMS.registerPreviewTemplate(
    'hero',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var getAsset = this.props.getAsset;
        var titleLines = arr(data.get('titleLines'));
        return Wrapper(
          h(
            'div',
            {
              style: {
                position: 'relative',
                height: '340px',
                overflow: 'hidden',
                borderRadius: '4px',
                marginBottom: '20px',
              },
            },
            ImgTag(getAsset, data.get('image'), data.get('imageAlt')),
            h(
              'div',
              {
                style: {
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(0deg, rgba(20,16,12,.6), rgba(20,16,12,0) 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '24px',
                  color: '#fff',
                },
              },
              h(
                'p',
                { style: { fontSize: '0.78rem', letterSpacing: '0.18em', marginBottom: '10px' } },
                data.get('eyebrow'),
              ),
              h(
                'h1',
                {
                  style: {
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    lineHeight: 1.5,
                    marginBottom: '10px',
                  },
                },
                titleLines.map(function (l, i) {
                  return h('span', { key: i }, l, i < titleLines.length - 1 && h('br'));
                }),
              ),
              h('p', { style: { fontSize: '0.9rem', opacity: 0.9 } }, data.get('description')),
            ),
          ),
        );
      },
    }),
  );

  // ---------- access (トップページ用ミニアクセス) ----------
  CMS.registerPreviewTemplate(
    'access',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var getAsset = this.props.getAsset;
        var accessList = arr(data.get('accessList'));
        var sceneryItems = arr(data.get('sceneryItems'));
        return Wrapper(
          h(
            'div',
            { style: { height: '220px', overflow: 'hidden', marginBottom: '24px' } },
            ImgTag(getAsset, data.get('heroImage'), data.get('heroImageAlt')),
          ),
          Eyebrow('道', data.get('eyebrow'), data.get('heading')),
          h(
            'div',
            { style: { marginBottom: '20px' } },
            accessList.map(function (item, i) {
              return LabelValueRow(get(item, 'label'), get(item, 'value'), i);
            }),
          ),
          h(
            'p',
            { style: { fontSize: '0.78rem', color: COLOR.inkFaint, marginBottom: '8px' } },
            data.get('shuttleNote'),
          ),
          h(
            'p',
            { style: { fontSize: '0.78rem', color: COLOR.inkFaint, marginBottom: '24px' } },
            data.get('note'),
          ),
          h(
            'h3',
            {
              style: {
                fontSize: '1.1rem',
                fontWeight: 600,
                marginBottom: '12px',
                color: COLOR.ink,
              },
            },
            data.get('sceneryHeading'),
          ),
          h(
            'p',
            { style: { color: COLOR.inkSoft, marginBottom: '16px', fontSize: '0.9rem' } },
            data.get('sceneryDescription'),
          ),
          h(
            'div',
            { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' } },
            sceneryItems.map(function (item, i) {
              return h(
                'div',
                { key: i },
                h(
                  'div',
                  { style: { height: '100px', overflow: 'hidden', marginBottom: '6px' } },
                  ImgTag(getAsset, get(item, 'img'), get(item, 'title')),
                ),
                h(
                  'p',
                  { style: { fontSize: '0.82rem', fontWeight: 600, color: COLOR.ink } },
                  get(item, 'title'),
                ),
                h(
                  'p',
                  { style: { fontSize: '0.74rem', color: COLOR.inkFaint } },
                  get(item, 'note'),
                ),
              );
            }),
          ),
        );
      },
    }),
  );

  // ---------- top_sections ----------
  CMS.registerPreviewTemplate(
    'top_sections',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var getAsset = this.props.getAsset;
        var titleLines = arr(data.get('titleLines'));
        var description = arr(data.get('description'));
        var images = arr(data.get('images'));
        return Wrapper(
          h(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1.6fr',
                gap: '28px',
                alignItems: 'start',
              },
            },
            h(
              'div',
              {},
              Eyebrow(data.get('icon'), data.get('eyebrow'), ''),
              h(
                'h2',
                {
                  style: {
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    marginBottom: '16px',
                    color: COLOR.ink,
                  },
                },
                titleLines.map(function (l, i) {
                  return h('span', { key: i }, l, i < titleLines.length - 1 && h('br'));
                }),
              ),
              h(
                'p',
                { style: { color: COLOR.inkSoft, marginBottom: '16px', fontSize: '0.9rem' } },
                description.map(function (l, i) {
                  return h('span', { key: i }, l, i < description.length - 1 && h('br'));
                }),
              ),
              data.get('linkText') &&
                h(
                  'span',
                  {
                    style: {
                      fontSize: '0.82rem',
                      color: COLOR.bengara,
                      borderBottom: '1px solid ' + COLOR.bengara,
                      paddingBottom: '3px',
                    },
                  },
                  data.get('linkText') + ' →',
                ),
            ),
            h(
              'div',
              {
                style: {
                  display: 'grid',
                  gridTemplateColumns: images.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                  gap: '10px',
                  height: '260px',
                },
              },
              images.map(function (img, i) {
                return h(
                  'div',
                  { key: i, style: { overflow: 'hidden' } },
                  ImgTag(getAsset, get(img, 'src'), get(img, 'alt')),
                );
              }),
            ),
          ),
        );
      },
    }),
  );

  // ---------- onsen-page ----------
  CMS.registerPreviewTemplate(
    'onsen-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var getAsset = this.props.getAsset;
        var quality = data.get('quality');
        var facilities = data.get('facilities');
        var stay = data.get('stay');
        var dayUse = data.get('dayUse');
        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
          Eyebrow(get(quality, 'icon'), get(quality, 'eyebrow'), get(quality, 'heading')),
          h(
            'div',
            { style: { marginBottom: '32px' } },
            arr(get(quality, 'items')).map(function (item, i) {
              return LabelValueRow(get(item, 'label'), get(item, 'value'), i);
            }),
          ),
          Eyebrow(get(facilities, 'icon'), get(facilities, 'eyebrow'), get(facilities, 'heading')),
          h(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '14px',
                marginBottom: '32px',
              },
            },
            arr(get(facilities, 'items')).map(function (item, i) {
              return Card(
                [
                  h(
                    'div',
                    {
                      key: 'i',
                      style: { height: '90px', overflow: 'hidden', marginBottom: '8px' },
                    },
                    ImgTag(getAsset, get(item, 'image'), get(item, 'imageAlt')),
                  ),
                  h(
                    'p',
                    { key: 'n', style: { fontWeight: 600, marginBottom: '4px', color: COLOR.ink } },
                    get(item, 'name'),
                  ),
                  h(
                    'p',
                    {
                      key: 'd',
                      style: { fontSize: '0.78rem', color: COLOR.inkSoft, marginBottom: '4px' },
                    },
                    get(item, 'description'),
                  ),
                  h(
                    'p',
                    { key: 'h', style: { fontSize: '0.72rem', color: COLOR.inkFaint } },
                    get(facilities, 'hoursLabel') + ': ' + get(item, 'hours'),
                  ),
                ],
                { key: i },
              );
            }),
          ),
          arr(get(facilities, 'notes')).length > 0 &&
            h(
              'div',
              { style: { marginBottom: '32px' } },
              arr(get(facilities, 'notes')).map(function (note, i) {
                return h(
                  'p',
                  { key: i, style: { fontSize: '0.78rem', color: COLOR.inkFaint } },
                  '※ ' + note,
                );
              }),
            ),
          h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } }, [
            h(
              'div',
              { key: 'stay' },
              Eyebrow(get(stay, 'icon'), get(stay, 'eyebrow'), get(stay, 'heading')),
              arr(get(stay, 'items')).map(function (item, i) {
                return LabelValueRow(get(item, 'label'), get(item, 'value'), i);
              }),
            ),
            h(
              'div',
              { key: 'dayUse' },
              Eyebrow(get(dayUse, 'icon'), get(dayUse, 'eyebrow'), get(dayUse, 'heading')),
              arr(get(dayUse, 'items')).map(function (item, i) {
                return LabelValueRow(get(item, 'label'), get(item, 'value'), i);
              }),
              arr(get(dayUse, 'rentals')).map(function (item, i) {
                return LabelValueRow(get(item, 'label'), get(item, 'value'), 'r' + i);
              }),
            ),
          ]),
        );
      },
    }),
  );

  // ---------- rooms-page ----------
  CMS.registerPreviewTemplate(
    'rooms-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var quickNav = arr(data.get('quickNav'));
        var stayNotice = data.get('stayNotice');
        var firstFloorNotice = data.get('firstFloorNotice');
        var commonAmenities = arr(data.get('commonAmenities'));
        var importantNotice = data.get('importantNotice');
        var priceNote = data.get('priceNote');
        var amenitiesEyebrow = data.get('amenitiesEyebrow');
        var amenitiesHeading = data.get('amenitiesHeading');

        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
          QuickNavBadges(quickNav),

          h(
            'p',
            { style: { fontSize: '0.8rem', color: COLOR.inkFaint, marginBottom: '20px' } },
            '※ 客室タイプ（和室・洋室など）本体は「03 客室ページ｜客室タイプ」コレクションで編集してください。',
          ),

          commonAmenities.length > 0 &&
            h(
              'div',
              { style: { marginTop: '24px', marginBottom: '24px' } },
              Eyebrow(get(data.get('intro'), 'icon'), amenitiesEyebrow, amenitiesHeading),
              h(
                'div',
                { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
                commonAmenities.map(function (a, i) {
                  return h(
                    'span',
                    {
                      key: i,
                      style: {
                        fontSize: '0.78rem',
                        border: '1px solid ' + COLOR.line,
                        borderRadius: '20px',
                        padding: '4px 12px',
                        color: COLOR.ink,
                      },
                    },
                    get(a, 'label') + (get(a, 'note') ? '（' + get(a, 'note') + '）' : ''),
                  );
                }),
              ),
            ),

          stayNotice &&
            h(
              'div',
              {
                style: {
                  marginBottom: '16px',
                  fontSize: '0.84rem',
                  color: COLOR.inkSoft,
                  borderTop: '1px solid ' + COLOR.line,
                  paddingTop: '12px',
                },
              },
              h(
                'p',
                { key: 'ci' },
                get(stayNotice, 'checkInLabel') + ': ' + get(stayNotice, 'checkInValue'),
              ),
              h(
                'p',
                { key: 'co' },
                get(stayNotice, 'checkOutLabel') + ': ' + get(stayNotice, 'checkOutValue'),
              ),
              h(
                'p',
                { key: 'pay' },
                get(stayNotice, 'paymentLabel') + ': ' + get(stayNotice, 'paymentValue'),
              ),
              h(
                'p',
                { key: 'cancel' },
                get(stayNotice, 'cancellationLabel') + ': ' + get(stayNotice, 'cancellationValue'),
              ),
            ),

          firstFloorNotice &&
            h(
              'div',
              { style: { marginBottom: '16px', fontSize: '0.8rem', color: COLOR.inkFaint } },
              h(
                'p',
                { style: { fontWeight: 600, marginBottom: '4px' } },
                get(firstFloorNotice, 'heading'),
              ),
              arr(get(firstFloorNotice, 'items')).map(function (it, i) {
                return h('p', { key: i }, '※ ' + it);
              }),
            ),

          priceNote &&
            h(
              'p',
              { style: { fontSize: '0.76rem', color: COLOR.inkFaint, marginBottom: '8px' } },
              '※ ' + priceNote,
            ),
          importantNotice &&
            h(
              'p',
              { style: { fontSize: '0.82rem', color: COLOR.bengara } },
              '※ ' + importantNotice,
            ),
        );
      },
    }),
  );

  // ---------- cuisine-page ----------
  function CuisinePlanCard(getAsset, plan, key, recommendedForLabel) {
    var menuExample = get(plan, 'menuExample');
    var recommendedFor = get(plan, 'recommendedFor');
    return Card(
      [
        h(
          'h4',
          {
            key: 'n',
            style: {
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: COLOR.ink,
              marginBottom: '10px',
            },
          },
          get(plan, 'name'),
        ),
        h(
          'div',
          { key: 'img', style: { height: '150px', overflow: 'hidden', marginBottom: '10px' } },
          ImgTag(getAsset, get(get(plan, 'image'), 'src'), get(get(plan, 'image'), 'alt')),
        ),
        // ★追加: おすすめの対象
        recommendedFor &&
          h(
            'p',
            {
              key: 'rec',
              style: {
                fontSize: '0.78rem',
                color: COLOR.bengara,
                marginBottom: '8px',
                background: '#F7EAE5',
                display: 'inline-block',
                padding: '2px 10px',
                borderRadius: '10px',
              },
            },
            (recommendedForLabel || '') + recommendedFor,
          ),
        Lines(get(plan, 'description')),
        menuExample &&
          h(
            'div',
            { key: 'menu', style: { marginTop: '10px' } },
            h(
              'p',
              {
                style: {
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: COLOR.indigo,
                  marginBottom: '4px',
                },
              },
              get(menuExample, 'heading'),
            ),
            h(
              'ul',
              { style: { paddingLeft: '18px', fontSize: '0.82rem', color: COLOR.ink } },
              arr(get(menuExample, 'items')).map(function (item, i) {
                return h('li', { key: i }, item);
              }),
            ),
          ),
        h(
          'p',
          { key: 'note', style: { fontSize: '0.74rem', color: COLOR.inkFaint, marginTop: '8px' } },
          '※ ' + get(plan, 'seasonalNote'),
        ),
      ],
      { key: key },
    );
  }
  CMS.registerPreviewTemplate(
    'cuisine-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var getAsset = this.props.getAsset;
        var dinner = data.get('dinner');
        var breakfast = data.get('breakfast');
        var diningVenues = data.get('diningVenues');
        var quickNav = arr(data.get('quickNav'));
        var guestConsiderations = arr(data.get('guestConsiderations'));
        var recommendedForLabel = get(dinner, 'recommendedForLabel');

        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),

          // ★追加: ページ内アンカーナビ
          QuickNavBadges(quickNav),

          Eyebrow(
            get(data.get('intro'), 'icon'),
            get(data.get('intro'), 'eyebrow'),
            get(data.get('intro'), 'heading'),
          ),
          Lines(get(data.get('intro'), 'description'), { marginBottom: '32px' }),
          Eyebrow(get(dinner, 'icon'), get(dinner, 'eyebrow'), get(dinner, 'heading')),
          h(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '24px',
              },
            },
            arr(get(dinner, 'plans')).map(function (p, i) {
              return CuisinePlanCard(getAsset, p, i, recommendedForLabel);
            }),
          ),
          Eyebrow(get(breakfast, 'icon'), get(breakfast, 'eyebrow'), get(breakfast, 'heading')),
          CuisinePlanCard(getAsset, get(breakfast, 'plan'), 'bf', recommendedForLabel),
          Eyebrow(
            get(diningVenues, 'icon'),
            get(diningVenues, 'eyebrow'),
            get(diningVenues, 'heading'),
          ),
          h(
            'div',
            { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' } },
            [get(diningVenues, 'inRoom'), get(diningVenues, 'hall')].map(function (v, i) {
              return Card(
                [
                  h(
                    'div',
                    {
                      key: 'img',
                      style: { height: '120px', overflow: 'hidden', marginBottom: '8px' },
                    },
                    ImgTag(getAsset, get(get(v, 'image'), 'src'), get(get(v, 'image'), 'alt')),
                  ),
                  h(
                    'p',
                    { key: 'h', style: { fontWeight: 600, color: COLOR.ink, marginBottom: '6px' } },
                    get(v, 'heading'),
                  ),
                  Lines(get(v, 'description')),
                  // ★追加: 注意書き（note）
                  get(v, 'note') &&
                    h(
                      'p',
                      {
                        key: 'note',
                        style: { fontSize: '0.74rem', color: COLOR.inkFaint, marginTop: '6px' },
                      },
                      '※ ' + get(v, 'note'),
                    ),
                ],
                { key: i },
              );
            }),
          ),

          // ★追加: プランに関する注意書き（planNote）
          arr(get(diningVenues, 'planNote')).length > 0 &&
            h(
              'div',
              {
                style: {
                  marginTop: '16px',
                  marginBottom: '16px',
                  fontSize: '0.82rem',
                  color: COLOR.inkSoft,
                },
              },
              arr(get(diningVenues, 'planNote')).map(function (line, i) {
                return h('p', { key: i }, line);
              }),
            ),

          // ★追加: ご利用にあたっての注意事項（アレルギー対応・お子様連れ等）
          guestConsiderations.length > 0 &&
            h(
              'div',
              {
                style: {
                  marginTop: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                },
              },
              guestConsiderations.map(function (item, i) {
                return Card(
                  [
                    h(
                      'p',
                      { key: 'h', style: { fontWeight: 600, color: COLOR.ink } },
                      get(item, 'icon') + ' ' + get(item, 'heading'),
                    ),
                    h(
                      'p',
                      { key: 'd', style: { fontSize: '0.82rem', color: COLOR.inkSoft } },
                      get(item, 'description'),
                    ),
                  ],
                  { key: i },
                );
              }),
            ),
        );
      },
    }),
  );

  // ---------- facilities-page ----------
  CMS.registerPreviewTemplate(
    'facilities-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var getAsset = this.props.getAsset;
        var facilitiesSection = data.get('facilitiesSection');
        var servicesSection = data.get('servicesSection');
        var activitiesSection = data.get('activitiesSection');
        var quickNav = arr(data.get('quickNav'));
        var usageNotice = data.get('usageNotice');

        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),

          // ★追加: ページ内アンカーナビ
          QuickNavBadges(quickNav),

          Eyebrow(
            get(data.get('intro'), 'icon'),
            get(data.get('intro'), 'eyebrow'),
            get(data.get('intro'), 'heading'),
          ),
          Lines(get(data.get('intro'), 'description'), { marginBottom: '28px' }),

          Eyebrow(
            get(facilitiesSection, 'icon'),
            get(facilitiesSection, 'eyebrow'),
            get(facilitiesSection, 'heading'),
          ),
          h(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginBottom: '28px',
              },
            },
            arr(get(facilitiesSection, 'items')).map(function (item, i) {
              return Card(
                [
                  h(
                    'div',
                    {
                      key: 'img',
                      style: { height: '80px', overflow: 'hidden', marginBottom: '6px' },
                    },
                    ImgTag(
                      getAsset,
                      get(get(item, 'image'), 'src'),
                      get(get(item, 'image'), 'alt'),
                    ),
                  ),
                  h(
                    'p',
                    { key: 'n', style: { fontWeight: 600, color: COLOR.ink } },
                    get(item, 'name'),
                  ),
                  Lines(get(item, 'description')),
                  // ★追加: 利用時間・料金・支払方法・対応言語
                  h(
                    'div',
                    {
                      key: 'meta',
                      style: { marginTop: '6px', fontSize: '0.72rem', color: COLOR.inkFaint },
                    },
                    [
                      get(item, 'hours') &&
                        h(
                          'p',
                          { key: 'h' },
                          get(facilitiesSection, 'hoursLabel') + ': ' + get(item, 'hours'),
                        ),
                      get(item, 'fee') &&
                        h(
                          'p',
                          { key: 'f' },
                          get(facilitiesSection, 'feeLabel') + ': ' + get(item, 'fee'),
                        ),
                      get(item, 'payment') &&
                        h(
                          'p',
                          { key: 'p' },
                          get(facilitiesSection, 'paymentLabel') + ': ' + get(item, 'payment'),
                        ),
                      arr(get(item, 'languages')).length > 0 &&
                        h(
                          'p',
                          { key: 'l' },
                          get(facilitiesSection, 'languagesLabel') +
                            ': ' +
                            arr(get(item, 'languages')).join('／'),
                        ),
                    ],
                  ),
                ],
                { key: i },
              );
            }),
          ),

          Eyebrow(
            get(servicesSection, 'icon'),
            get(servicesSection, 'eyebrow'),
            get(servicesSection, 'heading'),
          ),
          h(
            'div',
            { style: { marginBottom: '28px' } },
            arr(get(servicesSection, 'items')).map(function (item, i) {
              return Card(
                [
                  h(
                    'p',
                    { key: 'n', style: { fontWeight: 600, color: COLOR.ink, marginBottom: '4px' } },
                    get(item, 'name') + (get(item, 'isFeatured') ? '（おすすめ）' : ''),
                  ),
                  Lines(get(item, 'description')),
                  // ★追加: 料金・コース・利用時間・受付時間・予約方法・場所
                  h(
                    'div',
                    {
                      key: 'meta',
                      style: { marginTop: '6px', fontSize: '0.76rem', color: COLOR.inkFaint },
                    },
                    [
                      get(item, 'fee') &&
                        h(
                          'p',
                          { key: 'fee' },
                          get(servicesSection, 'feeLabel') + ': ' + get(item, 'fee'),
                        ),
                      arr(get(item, 'plans')).length > 0 &&
                        h(
                          'p',
                          { key: 'plans' },
                          get(servicesSection, 'plansLabel') +
                            ': ' +
                            arr(get(item, 'plans')).join('／'),
                        ),
                      get(item, 'hours') &&
                        h(
                          'p',
                          { key: 'hours' },
                          get(servicesSection, 'hoursLabel') + ': ' + get(item, 'hours'),
                        ),
                      get(item, 'receptionHours') &&
                        h(
                          'p',
                          { key: 'rh' },
                          get(servicesSection, 'receptionHoursLabel') +
                            ': ' +
                            get(item, 'receptionHours'),
                        ),
                      get(item, 'reservationMethod') &&
                        h(
                          'p',
                          { key: 'rm' },
                          get(servicesSection, 'reservationMethodLabel') +
                            ': ' +
                            get(item, 'reservationMethod'),
                        ),
                      get(item, 'location') &&
                        h('p', { key: 'loc' }, '場所: ' + get(item, 'location')),
                    ],
                  ),
                  // ★追加: 注意事項
                  arr(get(item, 'notes')).length > 0 &&
                    h(
                      'ul',
                      { key: 'notes', style: { marginTop: '6px', paddingLeft: '16px' } },
                      arr(get(item, 'notes')).map(function (note, ni) {
                        return h(
                          'li',
                          { key: ni, style: { fontSize: '0.72rem', color: COLOR.inkFaint } },
                          '※ ' + note,
                        );
                      }),
                    ),
                ],
                { key: i },
              );
            }),
          ),

          Eyebrow(
            get(activitiesSection, 'icon'),
            get(activitiesSection, 'eyebrow'),
            get(activitiesSection, 'heading'),
          ),
          h(
            'div',
            { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' } },
            arr(get(activitiesSection, 'items')).map(function (item, i) {
              var plans = arr(get(item, 'includedInPlans'));
              var categories = toJS(get(item, 'categories')) || [];
              return Card(
                [
                  h(
                    'div',
                    {
                      key: 'img',
                      style: { height: '100px', overflow: 'hidden', marginBottom: '6px' },
                    },
                    ImgTag(
                      getAsset,
                      get(get(item, 'image'), 'src'),
                      get(get(item, 'image'), 'alt'),
                    ),
                  ),
                  h(
                    'p',
                    { key: 'n', style: { fontWeight: 600, color: COLOR.ink } },
                    get(item, 'name') + (get(item, 'isPartner') ? '（提携）' : ''),
                  ),
                  // ★追加: 店舗名
                  get(item, 'shopName') &&
                    h(
                      'p',
                      { key: 'shop', style: { fontSize: '0.74rem', color: COLOR.inkFaint } },
                      get(item, 'shopName'),
                    ),
                  h(
                    'p',
                    {
                      key: 'a',
                      style: { fontSize: '0.74rem', color: COLOR.inkFaint, marginBottom: '4px' },
                    },
                    [get(item, 'location'), get(item, 'accessFromHotel')]
                      .filter(Boolean)
                      .join(' / '),
                  ),
                  Lines(get(item, 'description')),
                  // ★追加: カテゴリタグ
                  categories.length > 0 &&
                    h(
                      'div',
                      {
                        key: 'cats',
                        style: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' },
                      },
                      categories.map(function (catId, ci) {
                        return h(
                          'span',
                          {
                            key: ci,
                            style: {
                              fontSize: '0.68rem',
                              background: '#F7EAE5',
                              color: COLOR.bengara,
                              borderRadius: '10px',
                              padding: '2px 8px',
                            },
                          },
                          catId,
                        );
                      }),
                    ),
                  // ★追加: 対象プラン（includedInPlans）
                  plans.length > 0 &&
                    h(
                      'div',
                      { key: 'plans', style: { marginTop: '6px' } },
                      h(
                        'p',
                        { style: { fontSize: '0.7rem', color: COLOR.inkFaint } },
                        get(activitiesSection, 'includedInPlansHeadingShort'),
                      ),
                      plans.map(function (plan, pi) {
                        return h(
                          'p',
                          { key: pi, style: { fontSize: '0.74rem', color: COLOR.ink } },
                          '・' + get(plan, 'name'),
                        );
                      }),
                    ),
                  // ★追加: 公式サイト
                  get(item, 'officialSite') &&
                    h(
                      'p',
                      {
                        key: 'os',
                        style: { fontSize: '0.72rem', color: COLOR.bengara, marginTop: '6px' },
                      },
                      get(activitiesSection, 'officialSiteLinkLabelShort') +
                        ': ' +
                        get(item, 'officialSite'),
                    ),
                  // ★追加: 注意事項
                  arr(get(item, 'notes')).length > 0 &&
                    h(
                      'ul',
                      { key: 'notes', style: { marginTop: '6px', paddingLeft: '16px' } },
                      arr(get(item, 'notes')).map(function (note, ni) {
                        return h(
                          'li',
                          { key: ni, style: { fontSize: '0.7rem', color: COLOR.inkFaint } },
                          '※ ' + note,
                        );
                      }),
                    ),
                ],
                { key: i },
              );
            }),
          ),

          // ★追加: 利用上の注意
          usageNotice &&
            h(
              'div',
              {
                style: {
                  marginTop: '28px',
                  borderTop: '1px solid ' + COLOR.line,
                  paddingTop: '16px',
                },
              },
              h(
                'p',
                { style: { fontWeight: 600, color: COLOR.indigo, marginBottom: '6px' } },
                get(usageNotice, 'heading'),
              ),
              arr(get(usageNotice, 'items')).map(function (note, i) {
                return h(
                  'p',
                  { key: i, style: { fontSize: '0.82rem', color: COLOR.inkSoft } },
                  '※ ' + note,
                );
              }),
            ),
        );
      },
    }),
  );

  // ---------- access-page ----------
  CMS.registerPreviewTemplate(
    'access-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var byTrain = data.get('byTrain');
        var byCar = data.get('byCar');
        var parking = data.get('parking');
        var surroundings = data.get('surroundings');
        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
          h(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px',
              },
            },
            [
              h(
                'div',
                { key: 'train' },
                Eyebrow(get(byTrain, 'icon'), get(byTrain, 'eyebrow'), get(byTrain, 'heading')),
                arr(get(byTrain, 'departures')).map(function (d, i) {
                  return LabelValueRow(
                    get(d, 'from') + ' → ' + get(byTrain, 'nearestStation'),
                    get(d, 'duration'),
                    i,
                  );
                }),
              ),
              h(
                'div',
                { key: 'car' },
                Eyebrow(get(byCar, 'icon'), get(byCar, 'eyebrow'), get(byCar, 'heading')),
                arr(get(byCar, 'departures')).map(function (d, i) {
                  return LabelValueRow(
                    get(d, 'from') + ' → ' + get(d, 'ic'),
                    get(d, 'duration'),
                    i,
                  );
                }),
              ),
            ],
          ),
          h(
            'p',
            { style: { fontWeight: 600, marginBottom: '6px', color: COLOR.indigo } },
            get(parking, 'heading'),
          ),
          Lines(get(parking, 'notes'), { marginBottom: '20px' }),
          h(
            'p',
            { style: { fontWeight: 600, marginBottom: '6px', color: COLOR.indigo } },
            get(surroundings, 'heading'),
          ),
          arr(get(surroundings, 'items')).map(function (item, i) {
            return LabelValueRow(get(item, 'label'), get(item, 'duration'), i);
          }),
        );
      },
    }),
  );

  // ---------- faq-page ----------
  CMS.registerPreviewTemplate(
    'faq-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var categories = arr(data.get('categories'));
        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
          categories.map(function (cat, ci) {
            return h(
              'div',
              { key: ci, style: { marginBottom: '24px' } },
              h(
                'h3',
                {
                  style: {
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: COLOR.ink,
                    marginBottom: '10px',
                  },
                },
                get(cat, 'icon') + '　' + get(cat, 'label'),
              ),
              arr(get(cat, 'items')).map(function (qa, qi) {
                return h(
                  'div',
                  { key: qi, style: { borderTop: '1px solid ' + COLOR.line, padding: '10px 0' } },
                  h(
                    'p',
                    { style: { fontWeight: 600, color: COLOR.bengara, marginBottom: '4px' } },
                    'Q. ' + get(qa, 'question'),
                  ),
                  h(
                    'p',
                    { style: { color: COLOR.inkSoft, fontSize: '0.88rem' } },
                    'A. ' + get(qa, 'answer'),
                  ),
                );
              }),
            );
          }),
        );
      },
    }),
  );

  // ---------- news（個別記事） ----------
  CMS.registerPreviewTemplate(
    'news',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var title = data.get('title') || '（タイトル未入力）';
        var body = arr(data.get('body'));
        return Wrapper(
          h(
            'div',
            {
              style: {
                marginBottom: '12px',
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: COLOR.inkFaint,
              },
            },
            h('span', {}, data.get('date')),
            h(
              'span',
              {
                style: {
                  border: '1px solid ' + COLOR.bengara,
                  color: COLOR.bengara,
                  borderRadius: '2px',
                  padding: '1px 8px',
                },
              },
              data.get('category'),
            ),
            data.get('isImportant') &&
              h('span', { style: { color: COLOR.bengara, fontWeight: 600 } }, '【重要】'),
          ),
          h(
            'h2',
            {
              style: {
                fontFamily: 'var(--font-serif)',
                fontSize: '1.3rem',
                fontWeight: 600,
                color: COLOR.ink,
                marginBottom: '14px',
              },
            },
            title,
          ),
          body.map(function (line, i) {
            return h(
              'p',
              {
                key: i,
                style: {
                  color: COLOR.inkSoft,
                  marginBottom: '8px',
                  fontSize: '0.9rem',
                  lineHeight: 1.9,
                },
              },
              line,
            );
          }),
        );
      },
    }),
  );

  // ---------- privacy-page ----------
  CMS.registerPreviewTemplate(
    'privacy-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var sections = arr(data.get('sections'));
        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
          sections.map(function (section, i) {
            return h(
              'div',
              { key: i, style: { borderBottom: '1px solid ' + COLOR.line, padding: '16px 0' } },
              h(
                'h4',
                {
                  style: {
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 600,
                    color: COLOR.ink,
                    marginBottom: '8px',
                  },
                },
                get(section, 'heading'),
              ),
              get(section, 'intro') &&
                h(
                  'p',
                  { style: { color: COLOR.inkSoft, fontSize: '0.88rem', marginBottom: '8px' } },
                  get(section, 'intro'),
                ),
              Lines(get(section, 'paragraphs')),
              h(
                'ul',
                { style: { paddingLeft: '18px' } },
                arr(get(section, 'list')).map(function (item, li) {
                  return h(
                    'li',
                    {
                      key: li,
                      style: { color: COLOR.inkSoft, fontSize: '0.88rem', marginBottom: '6px' },
                    },
                    item,
                  );
                }),
              ),
            );
          }),
        );
      },
    }),
  );

  // ---------- information-page ----------
  CMS.registerPreviewTemplate(
    'information-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var welfare = data.get('welfareSection');
        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
          Eyebrow('福', get(welfare, 'eyebrow'), get(welfare, 'heading')),
          h(
            'p',
            { style: { color: COLOR.inkSoft, marginBottom: '16px', fontSize: '0.9rem' } },
            get(welfare, 'description'),
          ),
          arr(get(welfare, 'items')).map(function (item, i) {
            return h(
              'div',
              {
                key: i,
                style: {
                  border: '1px solid ' + COLOR.line,
                  padding: '10px 14px',
                  marginBottom: '8px',
                  fontSize: '0.86rem',
                  color: COLOR.ink,
                },
              },
              get(item, 'name'),
            );
          }),
        );
      },
    }),
  );

  // ---------- recruit-page ----------
  CMS.registerPreviewTemplate(
    'recruit-page',
    createClass({
      render: function () {
        var data = this.props.entry.get('data');
        var getAsset = this.props.getAsset;
        var workLife = data.get('workLife');
        var positions = arr(data.get('positions'));
        var process = arr(data.get('process'));
        var benefits = arr(data.get('benefits'));
        var photos = arr(get(workLife, 'photos'));

        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
          h(
            'h2',
            {
              style: {
                fontFamily: 'var(--font-serif)',
                fontSize: '1.3rem',
                fontWeight: 600,
                whiteSpace: 'pre-line',
                color: COLOR.ink,
                marginBottom: '10px',
              },
            },
            data.get('heading'),
          ),
          Lines(data.get('description'), { marginBottom: '24px' }),

          h(
            'h3',
            { style: { fontWeight: 600, color: COLOR.indigo, marginBottom: '8px' } },
            get(workLife, 'heading'),
          ),
          h(
            'p',
            { style: { color: COLOR.inkSoft, fontSize: '0.88rem', marginBottom: '10px' } },
            get(workLife, 'description'),
          ),
          h(
            'ul',
            { style: { paddingLeft: '18px', marginBottom: '16px' } },
            arr(get(workLife, 'points')).map(function (p, i) {
              return h(
                'li',
                {
                  key: i,
                  style: { color: COLOR.inkSoft, fontSize: '0.86rem', marginBottom: '4px' },
                },
                p,
              );
            }),
          ),

          // ★追加: 働く環境紹介の写真
          photos.length > 0 &&
            h(
              'div',
              { style: { display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' } },
              photos.map(function (photo, i) {
                return h(
                  'div',
                  { key: i, style: { width: '160px', height: '110px', overflow: 'hidden' } },
                  ImgTag(getAsset, get(photo, 'src'), get(photo, 'alt')),
                );
              }),
            ),

          h(
            'h3',
            { style: { fontWeight: 600, color: COLOR.indigo, marginBottom: '4px' } },
            data.get('positionsHeading'),
          ),
          h(
            'p',
            { style: { color: COLOR.inkSoft, fontSize: '0.86rem', marginBottom: '12px' } },
            data.get('positionsDescription'),
          ),
          h(
            'div',
            {
              style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '24px',
              },
            },
            positions.map(function (pos, i) {
              var tags = toJS(get(pos, 'tags')) || [];
              return Card(
                [
                  h(
                    'p',
                    { key: 'title', style: { fontWeight: 600, color: COLOR.ink } },
                    get(pos, 'title') +
                      '（' +
                      get(pos, 'employmentType') +
                      '・' +
                      get(pos, 'status') +
                      '）',
                  ),
                  h(
                    'p',
                    {
                      key: 'sum',
                      style: { fontSize: '0.82rem', color: COLOR.inkSoft, margin: '6px 0' },
                    },
                    get(pos, 'summary'),
                  ),
                  h(
                    'p',
                    { key: 'sal', style: { fontSize: '0.8rem', color: COLOR.bengara } },
                    get(pos, 'salaryRoughLabel'),
                  ),
                  h(
                    'div',
                    {
                      key: 'tags',
                      style: { display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' },
                    },
                    tags.map(function (t, ti) {
                      return h(
                        'span',
                        {
                          key: ti,
                          style: {
                            fontSize: '0.68rem',
                            background: '#F7EAE5',
                            color: COLOR.bengara,
                            borderRadius: '10px',
                            padding: '2px 8px',
                          },
                        },
                        t,
                      );
                    }),
                  ),
                ],
                { key: i },
              );
            }),
          ),

          h(
            'h3',
            { style: { fontWeight: 600, color: COLOR.indigo, marginBottom: '8px' } },
            data.get('processHeading'),
          ),
          process.map(function (step, i) {
            return h(
              'div',
              {
                key: i,
                style: {
                  display: 'flex',
                  gap: '10px',
                  borderTop: '1px solid ' + COLOR.line,
                  padding: '8px 0',
                },
              },
              h(
                'span',
                {
                  style: {
                    fontSize: '0.72rem',
                    background: COLOR.bengara,
                    color: '#fff',
                    borderRadius: '10px',
                    padding: '2px 8px',
                    height: 'fit-content',
                  },
                },
                'STEP ' + (i + 1),
              ),
              h(
                'div',
                {},
                h('p', { style: { fontWeight: 600, color: COLOR.ink } }, get(step, 'title')),
                h(
                  'p',
                  { style: { fontSize: '0.82rem', color: COLOR.inkSoft } },
                  get(step, 'description'),
                ),
              ),
            );
          }),

          h(
            'h3',
            { style: { fontWeight: 600, color: COLOR.indigo, margin: '20px 0 8px' } },
            data.get('benefitsHeading'),
          ),
          h(
            'div',
            { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
            benefits.map(function (b, i) {
              return h(
                'span',
                {
                  key: i,
                  style: {
                    fontSize: '0.78rem',
                    border: '1px solid ' + COLOR.line,
                    borderRadius: '20px',
                    padding: '4px 12px',
                    color: COLOR.ink,
                  },
                },
                get(b, 'label'),
              );
            }),
          ),

          // ★追加: 連絡先（メール・電話）
          h(
            'div',
            {
              style: {
                marginTop: '24px',
                borderTop: '1px solid ' + COLOR.line,
                paddingTop: '16px',
                fontSize: '0.84rem',
                color: COLOR.ink,
              },
            },
            h('p', { key: 'email' }, data.get('emailLabel') + ': ' + data.get('emailAddress')),
            h('p', { key: 'tel' }, data.get('telLabel') + ': ' + data.get('tel')),
          ),
        );
      },
    }),
  );
})();
