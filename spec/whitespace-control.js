describe('whitespace control', function () {
  it('should strip whitespace around mustache calls', function () {
    var hash = { foo: 'bar<' };

    expectTemplate(' {{~foo~}} ').withInput(hash).toCompileTo('bar&lt;');

    expectTemplate(' {{~foo}} ').withInput(hash).toCompileTo('bar&lt; ');

    expectTemplate(' {{foo~}} ').withInput(hash).toCompileTo(' bar&lt;');

    expectTemplate(' {{~&foo~}} ').withInput(hash).toCompileTo('bar<');

    expectTemplate(' {{~{foo}~}} ').withInput(hash).toCompileTo('bar<');

    expectTemplate('1\n{{foo~}} \n\n 23\n{{bar}}4').toCompileTo('1\n23\n4');
  });

  describe('blocks', function () {
    it('should strip whitespace around simple block calls', function () {
      var hash = { foo: 'bar<' };

      expectTemplate(' {{~#if foo~}} bar {{~/if~}} ')
        .withInput(hash)
        .toCompileTo('bar');

      expectTemplate(' {{#if foo~}} bar {{/if~}} ')
        .withInput(hash)
        .toCompileTo(' bar ');

      expectTemplate(' {{~#if foo}} bar {{~/if}} ')
        .withInput(hash)
        .toCompileTo(' bar ');

      expectTemplate(' {{#if foo}} bar {{/if}} ')
        .withInput(hash)
        .toCompileTo('  bar  ');

      expectTemplate(' \n\n{{~#if foo~}} \n\nbar \n\n{{~/if~}}\n\n ')
        .withInput(hash)
        .toCompileTo('bar');

      expectTemplate(' a\n\n{{~#if foo~}} \n\nbar \n\n{{~/if~}}\n\na ')
        .withInput(hash)
        .toCompileTo(' abara ');
    });

    it('should strip whitespace around inverse block calls', function () {
      expectTemplate(' {{~^if foo~}} bar {{~/if~}} ').toCompileTo('bar');

      expectTemplate(' {{^if foo~}} bar {{/if~}} ').toCompileTo(' bar ');

      expectTemplate(' {{~^if foo}} bar {{~/if}} ').toCompileTo(' bar ');

      expectTemplate(' {{^if foo}} bar {{/if}} ').toCompileTo('  bar  ');

      expectTemplate(
        ' \n\n{{~^if foo~}} \n\nbar \n\n{{~/if~}}\n\n '
      ).toCompileTo('bar');
    });

    it('should strip whitespace around complex block calls', function () {
      var hash = { foo: 'bar<' };

      expectTemplate('{{#if foo~}} bar {{~^~}} baz {{~/if}}')
        .withInput(hash)
        .toCompileTo('bar');

      expectTemplate('{{#if foo~}} bar {{^~}} baz {{/if}}')
        .withInput(hash)
        .toCompileTo('bar ');

      expectTemplate('{{#if foo}} bar {{~^~}} baz {{~/if}}')
        .withInput(hash)
        .toCompileTo(' bar');

      expectTemplate('{{#if foo}} bar {{^~}} baz {{/if}}')
        .withInput(hash)
        .toCompileTo(' bar ');

      expectTemplate('{{#if foo~}} bar {{~else~}} baz {{~/if}}')
        .withInput(hash)
        .toCompileTo('bar');

      expectTemplate(
        '\n\n{{~#if foo~}} \n\nbar \n\n{{~^~}} \n\nbaz \n\n{{~/if~}}\n\n'
      )
        .withInput(hash)
        .toCompileTo('bar');

      expectTemplate(
        '\n\n{{~#if foo~}} \n\n{{{foo}}} \n\n{{~^~}} \n\nbaz \n\n{{~/if~}}\n\n'
      )
        .withInput(hash)
        .toCompileTo('bar<');

      expectTemplate('{{#if foo~}} bar {{~^~}} baz {{~/if}}').toCompileTo(
        'baz'
      );

      expectTemplate('{{#if foo}} bar {{~^~}} baz {{/if}}').toCompileTo('baz ');

      expectTemplate('{{#if foo~}} bar {{~^}} baz {{~/if}}').toCompileTo(
        ' baz'
      );

      expectTemplate('{{#if foo~}} bar {{~^}} baz {{/if}}').toCompileTo(
        ' baz '
      );

      expectTemplate('{{#if foo~}} bar {{~else~}} baz {{~/if}}').toCompileTo(
        'baz'
      );

      expectTemplate(
        '\n\n{{~#if foo~}} \n\nbar \n\n{{~^~}} \n\nbaz \n\n{{~/if~}}\n\n'
      ).toCompileTo('baz');
    });

    it('GH-1716: should strip trailing indent from chained else if blocks', function () {
      expectTemplate(
        '{{#if a}}\n {{#if a.b}}\n no\n {{else if a.b}}\n no\n {{else}}\n yes\n {{/if}}\n after\n{{/if}}'
      )
        .withInput({ a: { c: true } })
        .toCompileTo(' yes\n after\n');
    });

    it('GH-2031: whitespace control in one else if branch should not affect another branch', function () {
      var string =
        '{{#if a}}\na\n{{else if b}}\nb\n{{else if c}}\nc\n{{~else if d}}\nd\n{{else if e}}\ne\n{{else if f}}\nf{{/if}}';
      expectTemplate(string).withInput({ c: 1 }).toCompileTo('c');

      expectTemplate(string).withInput({ d: 1 }).toCompileTo('d\n');

      expectTemplate(string).withInput({ e: 1 }).toCompileTo('e\n');
    });
  });

  it('should strip whitespace around partials', function () {
    expectTemplate('foo {{~> dude~}} ')
      .withPartials({ dude: 'bar' })
      .toCompileTo('foobar');

    expectTemplate('foo {{> dude~}} ')
      .withPartials({ dude: 'bar' })
      .toCompileTo('foo bar');

    expectTemplate('foo {{> dude}} ')
      .withPartials({ dude: 'bar' })
      .toCompileTo('foo bar ');

    expectTemplate('foo\n {{~> dude}} ')
      .withPartials({ dude: 'bar' })
      .toCompileTo('foobar');

    expectTemplate('foo\n {{> dude}} ')
      .withPartials({ dude: 'bar' })
      .toCompileTo('foo\n bar');
  });

  it('should only strip whitespace once', function () {
    expectTemplate(' {{~foo~}} {{foo}} {{foo}} ')
      .withInput({ foo: 'bar' })
      .toCompileTo('barbar bar ');
  });
});
