import React from 'react';
import { mount } from 'enzyme';
import { JSDOM } from 'jsdom';
import styled from 'styled-components';

// SuT
import ContentEditable from '../react-sane-contenteditable';

// jsDOM
const doc = new JSDOM('<!doctype html><html><body></body></html>');
const mockedRange = {
  cloneRange: jest.fn(() => mockedRange),
  collapse: jest.fn(),
  selectNodeContents: jest.fn(),
  setEnd: jest.fn(),
  setStart: jest.fn(),
  // toString: jest.fn(),
};

global.document = doc;
global.window = doc.defaultView;
global.document.getSelection = jest.fn(() => ({
  addRange: jest.fn(),
  getRangeAt: jest.fn(() => mockedRange),
  rangeCount: 0,
  removeAllRanges: jest.fn(),
}));

global.document.createRange = jest.fn(() => mockedRange);

// Helpers
const focusThenBlur = (wrapper, element = 'div') =>
  wrapper.find(element).simulate('focus').simulate('blur');

// Styled components
const Wrapper = styled.div``;

describe('Default behaviour', () => {
  it('renders a div by default', () => {
    const wrapper = mount(<ContentEditable />);
    expect(wrapper.childAt(0)).toHaveLength(1);
  });

  it('sets contentEditable', () => {
    const wrapper = mount(<ContentEditable />);

    expect(wrapper.childAt(0).prop('contentEditable')).toBe(true);
  });

  it('sets a default style', () => {
    const wrapper = mount(<ContentEditable />);
    expect(wrapper.childAt(0).prop('style')).toHaveProperty('whiteSpace', 'pre-wrap');
  });

  it('onInput sets state.value', () => {
    const mockHandler = jest.fn();
    const wrapper = mount(<ContentEditable content="foo" onChange={mockHandler} />);
    const nextInput = 'foo bar';

    wrapper.childAt(0).simulate('input', { target: { innerText: nextInput } });

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][1]).toBe(nextInput);
  });
});

describe('Handles props', () => {
  it('renders a tagName', () => {
    const tag = 'p';
    const wrapper = mount(<ContentEditable tagName={tag} />);
    expect(wrapper.find(tag)).toHaveLength(1);
  });

  it('spreads in the style prop', () => {
    const wrapper = mount(<ContentEditable style={{ color: 'blue' }} />);
    expect(wrapper.childAt(0).prop('style')).toMatchObject({
      whiteSpace: 'pre-wrap',
      color: 'blue',
    });
  });

  it('renders the props.content', () => {
    const content = 'foo';
    const wrapper = mount(<ContentEditable content={content} />);
    expect(wrapper.childAt(0).text()).toEqual(content);
  });

  it('renders an updated props.content', () => {
    const content = 'foo';
    const nextContent = 'foo bar';
    const wrapper = mount(<ContentEditable content={content} />);

    wrapper.setProps({ content: nextContent });

    expect(wrapper.render().text()).toEqual(nextContent);
  });

  it('toggles "contentEditable" when props.editable={false}', () => {
    const wrapper = mount(<ContentEditable editable={false} />);
    expect(wrapper.childAt(0).prop('contentEditable')).toBe(false);
  });

  it('attributes and customProps are passed down', () => {
    const wrapper = mount(<ContentEditable foo="bar" />);
    expect(wrapper.childAt(0).prop('foo')).toEqual('bar');
  });

  it('props.styled={false} sets ref handler', () => {
    const wrapper = mount(<ContentEditable />);
    expect(wrapper.instance().ref).toBeTruthy();
  });

  it('props.styled={true} sets innerRef handler', () => {
    const wrapper = mount(<ContentEditable styled tagName={Wrapper} />);
    expect(wrapper.childAt(0).prop('innerRef')).toEqual(expect.any(Function));
  });

  it('props.content change updates state', () => {
    const content = '';
    const nextContent = 'foo';
    const wrapper = mount(<ContentEditable content={content} />);

    wrapper.setProps({ content: nextContent });
    expect(wrapper.state('value')).toEqual(nextContent);
  });

  it('props.focus sets focus on update', () => {
    const wrapper = mount(<ContentEditable focus />);
    const instance = wrapper.instance();
    const ref = instance.ref;
    jest.spyOn(ref, 'focus');

    instance.componentDidMount();

    expect(ref.focus).toHaveBeenCalled();
  });

  it('renders the props.content respecting maxLength={5} on mount', () => {
    const wrapper = mount(<ContentEditable content="foo bar" maxLength={5} />);
    expect(wrapper.childAt(0).text()).toEqual('foo b');
  });

  it('props.focus sets default value for state.caretPosition on mount', () => {
    const wrapper = mount(<ContentEditable content="foo" focus />);

    expect(wrapper.state('caretPosition')).toEqual(0);
  });

  it('props.focus & props.caretPosition=end sets state.caretPosition on mount', () => {
    const wrapper = mount(<ContentEditable caretPosition="end" content="foo" focus />);

    expect(wrapper.state('caretPosition')).toEqual(3);
  });

  it('props.caretPosition sets state.caretPosition on update', () => {
    const wrapper = mount(<ContentEditable caretPosition="start" content="foo" focus />);

    expect(wrapper.state('caretPosition')).toEqual(0);

    wrapper.setProps({ caretPosition: 'end' });

    expect(wrapper.state('caretPosition')).toEqual(3);
  });

  it('props.focus=false sets state.caretPosition=null on mount', () => {
    const wrapper = mount(<ContentEditable content="foo" focus={false} />);

    expect(wrapper.state('caretPosition')).toEqual(null);
  });

  it('props.focus=false sets state.caretPosition=null on update', () => {
    const wrapper = mount(<ContentEditable content="foo" focus={false} />);

    wrapper.setProps({ content: 'foo bar' });

    expect(wrapper.state('caretPosition')).toEqual(null);
  });
});

describe('Handles selections', () => {
  const mockedSelection = global.document.getSelection();

  afterEach(() => {
    global.document.getSelection = jest.fn(() => mockedSelection);
  });

  it('sets state.caretPosition correctly when rangeCount > 0', () => {
    const startOffset = 4;
    const endOffset = 7;
    const content = 'foo-bar';
    const nextContent = 'foo-';

    global.document.getSelection = jest.fn(() => ({
      ...mockedSelection,
      rangeCount: 1,
      getRangeAt: jest.fn(() => ({
        ...mockedRange,
        cloneRange: jest.fn(() => ({
          ...mockedRange,
          toString: jest.fn(() => ({ length: startOffset })),
        })),
        endOffset,
        startOffset,
      })),
    }));

    const wrapper = mount(<ContentEditable content={content} focus />);

    wrapper.childAt(0).simulate('input', { target: { innerText: nextContent } });

    expect(wrapper.state('caretPosition')).toEqual(startOffset);
    expect(wrapper.text()).toEqual(nextContent);
  });
});

describe('Sanitisation', () => {
  it('does not sanitise when props.sanitise={false}', () => {
    const content = 'foo&nbsp;bar';
    const wrapper = mount(<ContentEditable content={content} sanitise={false} />);

    expect(wrapper.state('value')).toEqual(content);
  });

  it('removes &nbsp;', () => {
    const wrapper = mount(<ContentEditable content="foo&nbsp;bar" />);

    expect(wrapper.text()).toEqual('foo bar');
  });

  // it('trims leading & trailing whitespace', () => {
  //   const wrapper = mount(<ContentEditable content=" foo " />);
  //
  //   expect(wrapper.state('value')).toEqual('foo');
  // });

  it('trims leading & trailing whitespace of each line', () => {
    const content = ' foo \n bar ';
    const wrapper = mount(<ContentEditable content={content} multiLine />);

    expect(wrapper.state('value')).toEqual('foo\nbar');
  });

  it('removes multiple spaces', () => {
    const mockHandler = jest.fn();
    const wrapper = mount(<ContentEditable content="foo  bar" onChange={mockHandler} />);

    expect(wrapper.state('value')).toEqual('foo bar');
  });

  it('replaces line terminator characters with a space', () => {
    const mockHandler = jest.fn();
    const content = 'foo\nbar';
    const wrapper = mount(<ContentEditable content={content} onChange={mockHandler} />);

    expect(wrapper.state('value')).toEqual('foo bar');
  });

  it('value trimmed when maxLength exceeded', () => {
    const maxLength = 5;
    const content = 'foo bar';
    const wrapper = mount(<ContentEditable content={content} maxLength={maxLength} />);

    expect(wrapper.state('value')).toHaveLength(maxLength);
  });

  it('replaces unicode spaces', () => {
    const unicodeChars = [
      '\u00a0',
      '\u2000',
      '\u2001',
      '\u2002',
      '\u2003',
      '\u2004',
      '\u2005',
      '\u2006',
      '\u2007',
      '\u2008',
      '\u2009',
      '\u200a',
      '\u200b',
      '\u2028',
      '\u2029',
      '\u202e',
      '\u202f',
      '\u3000',
    ].join('');
    const wrapper = mount(<ContentEditable content={`foo ${unicodeChars}bar`} />);

    expect(wrapper.text()).toEqual('foo bar');
  });

  it('calls sanitise prop when provided', () => {
    const content = 'foo';
    const nextContent = 'foo bar';
    const sanitise = jest.fn((value) => value);
    const wrapper = mount(<ContentEditable content={content} />);

    wrapper.setProps({ content: nextContent, sanitise });
    expect(sanitise).toHaveBeenCalledWith(nextContent, mockedRange);
  });

  describe('with props.multiLine', () => {
    it('limits consecutive line terminator characters to a maximum of 2', () => {
      const wrapper = mount(<ContentEditable content={'foo\n\n\nbar'} multiLine />);

      expect(wrapper.text()).toEqual('foo\n\nbar');
    });

    it('removes multiple spaces maintaining newlines', () => {
      const wrapper = mount(
        <ContentEditable content={'foo  bar\f\f \r\rbaz\nqux\t\t quux\v\v quuz'} multiLine />,
      );

      expect(wrapper.text()).toEqual('foo bar baz\nqux quux quuz');
    });

    it('replaces ASCII spaces and feeds', () => {
      const wrapper = mount(
        <ContentEditable content={'foo\f\f bar\r\r baz\t\t qux\v\v quux'} multiLine />,
      );

      expect(wrapper.text()).toEqual('foo bar baz qux quux');
    });

    xdescribe('Failing tests to fix in component', () => {
      // @todo @fixme: Component should probably be fixed so that this test passes,
      // given that it uses dangerouslySetInnerHTML
      // the naming of props.sanitise suggests that it will protect against this.
      it('protects against XSS input', () => {
        const mockHandler = jest.fn();
        const content = 'foo';
        const wrapper = mount(<ContentEditable content={content} onChange={mockHandler} />);

        wrapper.instance()._element.innerText = `foo
 <script>console.log('XSS vulnerability')</script>`;
        focusThenBlur(wrapper);
        expect(wrapper.state('value')).toEqual(content);
      });
    });
  });
});

describe('Calls handlers', () => {
  it('props.innerRef called', () => {
    const mockHandler = jest.fn();
    mount(<ContentEditable innerRef={mockHandler} />);

    expect(mockHandler).toHaveBeenCalled();
  });

  it('props.onBlur called', () => {
    const mockHandler = jest.fn();
    const content = 'foo';
    const wrapper = mount(<ContentEditable content={content} onBlur={mockHandler} />);

    wrapper.childAt(0).simulate('blur');

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'blur',
      }),
      content,
    );
  });

  it('props.onChange called', () => {
    const mockHandler = jest.fn();
    const wrapper = mount(<ContentEditable content="foo" onChange={mockHandler} />);
    const nextInput = 'foo bar';

    wrapper.childAt(0).simulate('input', { target: { innerText: nextInput } });

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][1]).toBe(nextInput);
  });

  it('props.onKeyDown called', () => {
    const mockHandler = jest.fn();
    const content = 'foo';
    const wrapper = mount(<ContentEditable content={content} onKeyDown={mockHandler} />);

    wrapper.childAt(0).simulate('keydown', { key: 'Enter', target: { innerText: content } });

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        nativeEvent: expect.any(Object),
      }),
      content,
    );
  });

  it('props.onKeyUp called', () => {
    const mockHandler = jest.fn();
    const content = '';
    const nextContent = 'f';
    const wrapper = mount(<ContentEditable content={content} onKeyUp={mockHandler} />);

    wrapper.childAt(0).simulate('keyup', { target: { innerText: nextContent } });

    expect(mockHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keyup',
        nativeEvent: expect.any(Object),
      }),
      nextContent,
    );
  });

  it('onKeyDown event.preventDefault called when maxLength exceeded', () => {
    const mockPreventDefault = jest.fn();
    const content = 'foo bar';
    const wrapper = mount(<ContentEditable content={content} maxLength={content.length} />);

    wrapper.childAt(0).simulate('keydown', {
      key: 'Enter',
      preventDefault: mockPreventDefault,
      target: { innerText: content },
    });
    expect(mockPreventDefault).toHaveBeenCalled();
  });

  it('onKeyDown (enter) handles caret with multiLine value', () => {
    const content = 'foobar';
    const nextContent = 'foo\nbar';
    const caretPosition = 3;
    const wrapper = mount(<ContentEditable content={content} multiLine />);
    const instance = wrapper.instance();

    // Mock caret and range
    jest.spyOn(instance, 'getCaret').mockImplementation(() => caretPosition);
    jest.spyOn(instance, 'getRange').mockImplementation(() => ({
      ...mockedRange,
      startOffset: caretPosition,
      endOffset: caretPosition,
    }));

    wrapper.childAt(0).simulate('keydown', { keyCode: 13, target: { innerText: content } });
    expect(wrapper.state()).toEqual({ caretPosition: caretPosition + 1, value: nextContent });
  });

  it('onKeyDown (enter) handles caret with multiLine at end of value', () => {
    const content = 'foo';
    const nextContent = 'foo\n\n';
    const caretPosition = 3;
    const wrapper = mount(<ContentEditable content={content} multiLine />);
    const instance = wrapper.instance();

    // Mock caret and range
    jest.spyOn(instance, 'getCaret').mockImplementation(() => caretPosition);
    jest.spyOn(instance, 'getRange').mockImplementation(() => ({
      ...mockedRange,
      startOffset: caretPosition,
      endOffset: caretPosition,
    }));

    wrapper.childAt(0).simulate('keydown', { keyCode: 13, target: { innerText: content } });
    expect(wrapper.state()).toEqual({ caretPosition: caretPosition + 1, value: nextContent });
  });

  it('onKeyDown (enter) handles caret (at linebreak) with multiLine value', () => {
    const content = 'foo\nbar';
    const nextContent = 'foo\n\nbar';
    const caretPosition = 3;
    const wrapper = mount(<ContentEditable content={content} multiLine />);
    const instance = wrapper.instance();

    // Mock caret and range
    jest.spyOn(instance, 'getCaret').mockImplementation(() => caretPosition);
    jest.spyOn(instance, 'getRange').mockImplementation(() => ({
      ...mockedRange,
      startOffset: caretPosition,
      endOffset: caretPosition,
    }));

    wrapper.childAt(0).simulate('keydown', { keyCode: 13, target: { innerText: content } });
    expect(wrapper.state()).toEqual({ caretPosition: caretPosition + 1, value: nextContent });
  });

  it('onKeyDown (enter) triggers blur when props.multiLine = false', () => {
    const content = 'foobar';
    const wrapper = mount(<ContentEditable content={content} />);
    const instance = wrapper.instance();
    const onBlur = (instance.ref.blur = jest.fn());

    wrapper.childAt(0).simulate('keydown', { keyCode: 13, target: { innerText: content } });
    expect(onBlur).toHaveBeenCalled();
  });

  it('props.onChange not called when maxLength exceeded', () => {
    const mockHandler = jest.fn();
    const wrapper = mount(<ContentEditable content="foo" maxLength={3} onChange={mockHandler} />);

    wrapper.childAt(0).simulate('input', { target: { innerText: 'foob' } });
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('props.onPaste called', () => {
    const mockOnPaste = jest.fn().mockName('onPaste');
    const mockExecCommand = jest.fn().mockName('execCommand');
    const mockGetClipboardData = jest.fn().mockName('getClipboardData');
    const content = 'foo';
    const wrapper = mount(<ContentEditable content={content} onPaste={mockOnPaste} />);
    const nextInput = 'bar';

    wrapper.instance().ref.innerText = '';

    document.execCommand = mockExecCommand;
    mockGetClipboardData.mockReturnValue(nextInput);

    wrapper.childAt(0).simulate('paste', {
      clipboardData: { getData: mockGetClipboardData },
    });
    expect(mockOnPaste).toHaveBeenCalledWith(nextInput);
  });
});
