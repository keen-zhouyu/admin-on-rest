import React from 'react';
import assert from 'assert';
import { render } from 'enzyme';
import RichTextField, { removeTags } from './RichTextField';

describe('stripTags', () => {
    it('should strip HTML tags from input', () => {
        assert.equal(removeTags('<h1>Hello world!</h1>'), 'Hello world!');
        assert.equal(removeTags('<p>Cake is a lie</p>'), 'Cake is a lie');
    });

    it('should strip HTML tags even with attributes', () => {
        assert.equal(removeTags('<a href="http://www.zombo.com">Zombo</a>'), 'Zombo');
        assert.equal(removeTags('<a target="_blank" href="http://www.zombo.com">Zombo</a>'), 'Zombo');
    });

    it('should strip HTML tags splitted on several lines', () => {
        assert.equal(removeTags(`<a
            href="http://www.zombo.com"
        >Zombo</a>`), 'Zombo');
    });

    it('should strip HTML embedded tags', () => {
        assert.equal(
            removeTags('<marquee><a href="http://www.zombo.com">Zombo</a></marquee>'),
            'Zombo'
        );
    });

    it('should strip HTML tags even if they are malformed', () => {
        assert.equal(
            removeTags('<p>All our base is belong to us.<p>'),
            'All our base is belong to us.'
        );
    });
});

describe('<RichTextField />', () => {
    it('should render as HTML', () => {
        const record = { body: '<h1>Hello world!</h1>' };
        const wrapper = render(<RichTextField record={record} source="body" />);
        assert.equal(wrapper.html(), '<div><h1>Hello world!</h1></div>');
    });

    it('should handle deep fields', () => {
        const record = { foo: { body: '<h1>Hello world!</h1>' } };
        const wrapper = render(<RichTextField record={record} source="foo.body" />);
        assert.equal(wrapper.html(), '<div><h1>Hello world!</h1></div>');
    });

    it('should strip HTML tags if stripTags is set to true', () => {
        const record = { body: '<h1>Hello world!</h1>' };
        const wrapper = render(<RichTextField stripTags={true} record={record} source="body" />);

        assert.equal(wrapper.html(), '<div>Hello world!</div>');
    });

    it('should not strip HTML tags if stripTags is set to false', () => {
        const record = { body: '<h1>Hello world!</h1>' };
        const wrapper = render(<RichTextField stripTags={false} record={record} source="body" />);

        assert.equal(wrapper.html(), '<div><h1>Hello world!</h1></div>');
    });
});
