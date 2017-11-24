import { Editor } from 'slate-react'
import { Value } from 'slate'
import React from 'react'
import ToolbarButton from './components/ToolbarButton'
import ToolbarMenu from './components/ToolbarMenu'

import { MarkPlugin, MarkButton } from './plugins/Mark'
import { BlockPlugin, BlockButton } from './plugins/Block'
import { VoidPlugin, VoidButton } from './plugins/Void'
import { ColorPlugin, ColorButton } from './plugins/Color'
import { PlainButton } from './plugins/Plain'
import { TablePlugin, TableButton } from './plugins/Table'
import EditTable from 'slate-edit-table'

const plugins = [
  MarkPlugin({ mark: 'bold', tag: 'strong', hotkey: 'mod+b' }),
  MarkPlugin({ mark: 'italic', tag: 'em', hotkey: 'mod+i' }),
  MarkPlugin({ mark: 'underline', tag: 'u', hotkey: 'mod+u' }),
  MarkPlugin({ mark: 'strikethrough', tag: 's' }),
  BlockPlugin({ block: 'block-quote', tag: 'blockquote' }),
  BlockPlugin({ block: 'numbered-list', tag: 'ol' }),
  BlockPlugin({ block: 'bulleted-list', tag: 'ul' }),
  BlockPlugin({ block: 'list-item', tag: 'li' }),
  BlockPlugin({ block: 'heading-one', tag: 'h1' }),
  BlockPlugin({ block: 'heading-two', tag: 'h2' }),
  VoidPlugin({ type: 'horizontal-rule', tag: 'hr' }),
  VoidPlugin({ type: 'underbar', tag: 'span', attributes: { className: 'underbar' } }),
  VoidPlugin({ type: 'underbar_l', tag: 'span', attributes: { className: 'underbar_l' } }),
  VoidPlugin({ type: 'underbar_xl', tag: 'span', attributes: { className: 'underbar_xl' } }),
  ColorPlugin({ type: 'color' }),
  TablePlugin({ type: 'arrow' }),
  EditTable()
]

const initialValue = {
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [],
      },
    ],
  },
}

/**
 * Our editor!
 *
 * @type {Component}
 */
class TopicEditor extends React.Component {
  /**
   * Deserialize the initial editor value.
   *
   * @type {Object}
   */

  state = {
    value: Value.fromJSON(initialValue),
    menus: {},
    debug: false,
  };

  /**
   * On change, save the new `value`, and hide the color menu
   *
   * @param {Change} change
   */

  onChange = ({ value }) => {
    if (this.state.debug) {
      console.log(JSON.stringify(value.toJSON()))
    }
    this.setState({
      value,
      menus: {},
    })
  };

  /**
   * On undo in history.
   *
   */

  onClickUndo = event => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().undo()
    this.onChange(change)
  }

  /**
   * On redo in history.
   *
   */

  onClickRedo = event => {
    event.preventDefault()
    const { value } = this.state
    const change = value.change().redo()
    this.onChange(change)
  }

  /**
   * Render.
   *
   * @return {Element}
   */

  render () {
    return (
      <div>
        {this.renderToolbar()}
        {this.renderEditor()}
      </div>
    )
  }

  /**
   * Keeping menu state top-level
   *
   */

  onMenuToggle = (event, type) => {
    event.preventDefault()
    const menus = {}
    if (!this.state.menus[type]) {
      menus[type] = true
    }
    this.setState({ menus })
  }

  /**
   * Render the toolbar.
   *

   * @return {Element}
   */

  renderToolbar = () => {
    const sharedProps = { value: this.state.value, onChange: this.onChange }
    const menuProps = { menus: this.state.menus, onMenuToggle: this.onMenuToggle }

    return (
      <div className="menu toolbar-menu">
        <MarkButton mark="bold" icon="bold" title="Bold" {...sharedProps} />
        <MarkButton mark="italic" icon="italic" title="Italic" {...sharedProps} />
        <MarkButton mark="underline" icon="underline" title="Underline" {...sharedProps} />
        <MarkButton mark="strikethrough" icon="strikethrough" title="Strikethrough" {...sharedProps} />
        <BlockButton block="heading-one" icon="angle-double-up" title="Heading One" {...sharedProps} />
        <BlockButton block="heading-two" icon="angle-up" title="Heading Two" {...sharedProps} />
        <BlockButton block="block-quote" icon="quote-right" title="Block Quote" {...sharedProps} />
        <BlockButton block="numbered-list" icon="list-ol" title="Numbered List" {...sharedProps} />
        <BlockButton block="bulleted-list" icon="list-ul" title="Bulleted List" {...sharedProps} />
        <ToolbarMenu type="color" icon="eyedropper" title="Font Color" {...menuProps}>
          <div className="menu">
            <ColorButton color="black" icon="font" title="Block" {...sharedProps} />
            <ColorButton color="grey" icon="font" title="Grey" {...sharedProps} />
            <ColorButton color="darkgrey" icon="font" title="Dark Grey" {...sharedProps} />
          </div>
          <div className="menu">
            <ColorButton color="red" icon="font" title="Red" {...sharedProps} />
            <ColorButton color="yellow" icon="font" title="Yellow" {...sharedProps} />
            <ColorButton color="blue" icon="font" title="Blue" {...sharedProps} />
          </div>
          <div className="menu">
            <ColorButton color="male" icon="mars" title="Male" {...sharedProps} />
            <ColorButton color="female" icon="venus" title="Female" {...sharedProps} />
            <ColorButton color="neuter" icon="neuter" title="Neuter" {...sharedProps} />
          </div>
          <div className="menu">
            <ColorButton color="dative" icon="arrows-h" title="Dative" {...sharedProps} />
            <ColorButton color="accusative" icon="times" title="Accusative" {...sharedProps} />
          </div>
        </ToolbarMenu>
        <ToolbarMenu type="character" icon="keyboard-o" title="Character Map" {...menuProps}>
          <div className="menu">
            <PlainButton text="←" title="Left Arrow" {...sharedProps} />
            <PlainButton text="→" title="Right Arrow" {...sharedProps} />
            <PlainButton text="↔" title="Left Right Arrow" {...sharedProps} />
            <PlainButton text="⇐" title="Leftwards Double Arrow" {...sharedProps} />
            <PlainButton text="⇒" title="Rightwards Double Arrow" {...sharedProps} />
          </div>
          <div className="menu">
            <PlainButton text="…" title="Ellipsis" {...sharedProps} />
            <PlainButton text="«" title="Double Low Quote" {...sharedProps} />
            <PlainButton text="»" title="Double High Quote" {...sharedProps} />
            <PlainButton text="„" title="Double Angle Left Quote" {...sharedProps} />
            <PlainButton text="”" title="Double Angle Right Quote" {...sharedProps} />
          </div>
        </ToolbarMenu>
        <ToolbarMenu type="rule" icon="reorder" title="Rules" {...menuProps}>
          <VoidButton type="underbar" text="4: ____" title="Small Space" {...sharedProps} />
          <VoidButton type="underbar_l" text="6: ______" title="Medium Space" {...sharedProps} />
          <VoidButton type="underbar_xl" text="8: ________" title="Large Space" {...sharedProps} />
          <VoidButton type="horizontal-rule" text="HR: ———————" title="Horizontal Rule" {...sharedProps} />
        </ToolbarMenu>
        <ToolbarMenu type="patterns" icon="graduation-cap" title="Patterns" {...menuProps}>
          <TableButton type="table" icon="arrow-right" title="Arrow Table" {...sharedProps} />
        </ToolbarMenu>
        <ToolbarButton icon="undo" title="Undo" onMouseDown={this.onClickUndo} />
        <ToolbarButton icon="repeat" title="Redo" onMouseDown={this.onClickRedo} />
      </div>
    )
  };

  /**
   * Render the Slate editor.
   *
   * @return {Element}
   */

  renderEditor = () => {
    return (
      <div className="editor">
        <Editor
          placeholder="Teach a topic..."
          value={this.state.value}
          onChange={this.onChange}
          plugins={plugins}
          autoFocus
          spellCheck
        />
      </div>
    )
  };
}

/**
 * Export.
 */

export { TopicEditor }
