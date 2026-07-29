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

  function ImgTag(getAsset, src, alt, style) {
    if (!src) return null;
    var resolved = src;
    try {
      var asset = getAsset(src);
      if (asset) resolved = asset.toString();
    } catch (e) {}
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
  // （以前は Wrapper(children) が1引数しか受け取らず、Wrapper(A, B, C, ...) の
  //   B以降が全て黙って捨てられていたため「タイトルしか出ない」原因になっていた）
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
        var getAsset = this.props.getAsset;
        var sections = arr(data.get('sections'));
        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
          sections.map(function (section, si) {
            var rooms = arr(get(section, 'rooms'));
            return h(
              'div',
              { key: si, style: { marginBottom: '36px' } },
              rooms.map(function (room, ri) {
                var floors = arr(get(room, 'floors'));
                return Card(
                  [
                    Eyebrow(get(room, 'icon'), get(room, 'eyebrow'), get(room, 'name')),
                    h(
                      'div',
                      {
                        key: 'img',
                        style: { height: '160px', overflow: 'hidden', marginBottom: '10px' },
                      },
                      ImgTag(
                        getAsset,
                        get(get(room, 'image'), 'src'),
                        get(get(room, 'image'), 'alt'),
                      ),
                    ),
                    Lines(get(room, 'description')),
                    h(
                      'div',
                      {
                        key: 'basic',
                        style: {
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '10px',
                          margin: '10px 0',
                          fontSize: '0.78rem',
                          color: COLOR.inkFaint,
                        },
                      },
                      [
                        get(room, 'size') && h('span', { key: 's' }, '広さ: ' + get(room, 'size')),
                        h('span', { key: 'c' }, '定員: ' + get(room, 'capacity')),
                        h('span', { key: 'b' }, '寝具: ' + get(room, 'bedding')),
                        h('span', { key: 'v' }, '眺望: ' + get(room, 'view')),
                        h('span', { key: 'sm' }, '喫煙: ' + get(room, 'smoking')),
                      ],
                    ),
                    h(
                      'div',
                      { key: 'floors' },
                      floors.map(function (floor, fi) {
                        var images = arr(get(floor, 'images'));
                        var badges = toJS(get(floor, 'badges')) || [];
                        return h(
                          'div',
                          {
                            key: fi,
                            style: { borderTop: '1px dashed ' + COLOR.line, padding: '12px 0' },
                          },
                          h(
                            'p',
                            {
                              style: { fontWeight: 600, color: COLOR.indigo, marginBottom: '6px' },
                            },
                            get(floor, 'label'),
                          ),
                          badges.length > 0 &&
                            h(
                              'div',
                              {
                                style: {
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '6px',
                                  marginBottom: '8px',
                                },
                              },
                              badges.map(function (b, bi) {
                                return h(
                                  'span',
                                  {
                                    key: bi,
                                    style: {
                                      fontSize: '0.7rem',
                                      color: COLOR.bengara,
                                      border: '1px solid ' + COLOR.bengara,
                                      borderRadius: '2px',
                                      padding: '2px 8px',
                                    },
                                  },
                                  b,
                                );
                              }),
                            ),
                          h(
                            'div',
                            {
                              style: {
                                display: 'grid',
                                gridTemplateColumns:
                                  'repeat(' + Math.max(images.length, 1) + ', 1fr)',
                                gap: '8px',
                                marginBottom: '8px',
                              },
                            },
                            images.map(function (img, ii) {
                              return h(
                                'div',
                                { key: ii, style: { height: '90px', overflow: 'hidden' } },
                                ImgTag(getAsset, get(img, 'src'), get(img, 'alt')),
                              );
                            }),
                          ),
                          Lines(get(floor, 'description')),
                        );
                      }),
                    ),
                  ],
                  { key: ri },
                );
              }),
            );
          }),
        );
      },
    }),
  );

  // ---------- cuisine-page ----------
  function CuisinePlanCard(getAsset, plan, key) {
    var menuExample = get(plan, 'menuExample');
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
        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
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
              return CuisinePlanCard(getAsset, p, i);
            }),
          ),
          Eyebrow(get(breakfast, 'icon'), get(breakfast, 'eyebrow'), get(breakfast, 'heading')),
          CuisinePlanCard(getAsset, get(breakfast, 'plan'), 'bf'),
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
        return Wrapper(
          PageTitle(data.get('pageTitle'), data.get('pageTitleEn')),
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
              return LabelValueRow(
                get(item, 'name'),
                (get(item, 'fee') || '') + ' / ' + (get(item, 'hours') || ''),
                i,
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
                  h(
                    'p',
                    {
                      key: 'a',
                      style: { fontSize: '0.74rem', color: COLOR.inkFaint, marginBottom: '4px' },
                    },
                    get(item, 'accessFromHotel'),
                  ),
                  Lines(get(item, 'description')),
                ],
                { key: i },
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
            { style: { paddingLeft: '18px', marginBottom: '24px' } },
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
        );
      },
    }),
  );
})();
