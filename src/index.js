import { Editor } from 'slate-react'
import { Value } from 'slate'
import React from 'react'
import ToolbarButton from './components/ToolbarButton'

import Mark from './plugins/Mark'
import Block from './plugins/Block'
import Void from './plugins/Void'
import Color from './plugins/Color'
import Plain from './plugins/Plain'

const plugins = [
  Mark.MarkPlugin({ mark: 'bold', tag: 'strong', hotkey: 'mod+b' }),
  Mark.MarkPlugin({ mark: 'italic', tag: 'em', hotkey: 'mod+i' }),
  Mark.MarkPlugin({ mark: 'underline', tag: 'u', hotkey: 'mod+u' }),
  Block.BlockPlugin({ block: 'block-quote', tag: 'blockquote' }),
  Block.BlockPlugin({ block: 'numbered-list', tag: 'ol' }),
  Block.BlockPlugin({ block: 'bulleted-list', tag: 'ul' }),
  Block.BlockPlugin({ block: 'list-item', tag: 'li' }),
  Block.BlockPlugin({ block: 'heading-one', tag: 'h1' }),
  Block.BlockPlugin({ block: 'heading-two', tag: 'h2' }),
  Void.VoidPlugin({ type: 'horizontal-rule', tag: 'hr' }),
  Void.VoidPlugin({ type: 'underbar', tag: 'span', attributes: { className: 'underbar' } }),
  Void.VoidPlugin({ type: 'underbar_l', tag: 'span', attributes: { className: 'underbar_l' } }),
  Void.VoidPlugin({ type: 'underbar_xl', tag: 'span', attributes: { className: 'underbar_xl' } }),
  Color.ColorPlugin({ type: 'color' }),
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
    displayColorMenu: 'none',
    displayCharacterMenu: 'none',
    displayRuleMenu: 'none',
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
      displayColorMenu: 'none',
      displayCharacterMenu: 'none',
      displayRuleMenu: 'none',
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
   * On opening the color menu
   *
   */

  onClickColorMenu = event => {
    event.preventDefault()
    const { displayColorMenu } = this.state
    if (displayColorMenu === 'none') {
      this.setState({ displayColorMenu: 'block' })
    } else {
      this.setState({ displayColorMenu: 'none' })
    }
  }

  onClickCharacterMenu = event => {
    event.preventDefault()
    const { displayCharacterMenu } = this.state
    if (displayCharacterMenu === 'none') {
      this.setState({ displayCharacterMenu: 'block' })
    } else {
      this.setState({ displayCharacterMenu: 'none' })
    }
  }

  onClickRuleMenu = event => {
    event.preventDefault()
    const { displayRuleMenu } = this.state
    if (displayRuleMenu === 'none') {
      this.setState({ displayRuleMenu: 'block' })
    } else {
      this.setState({ displayRuleMenu: 'none' })
    }
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
   * Render the toolbar.
   *

   * @return {Element}
   */

  renderToolbar = () => {
    const sharedProps = { value: this.state.value, onChange: this.onChange }

    return (
      <div className="menu toolbar-menu">
        <Mark.MarkButton mark="bold" icon="bold" title="Bold" {...sharedProps} />
        <Mark.MarkButton mark="italic" icon="italic" title="Italic" {...sharedProps} />
        <Mark.MarkButton mark="underline" icon="underline" title="Underline" {...sharedProps} />
        <Block.BlockButton block="heading-one" icon="angle-double-up" title="Heading One" {...sharedProps} />
        <Block.BlockButton block="heading-two" icon="angle-up" title="Heading Two" {...sharedProps} />
        <Block.BlockButton block="block-quote" icon="quote-right" title="Block Quote" {...sharedProps} />
        <Block.BlockButton block="numbered-list" icon="list-ol" title="Numbered List" {...sharedProps} />
        <Block.BlockButton block="bulleted-list" icon="list-ul" title="Bulleted List" {...sharedProps} />
        <ToolbarButton icon="eyedropper" title="Font Color" onMouseDown={this.onClickColorMenu} />
        <div className="color-menu" style={{ display: this.state.displayColorMenu }}>
          <div className="menu">
            <Color.ColorButton color="black" icon="font" title="Block" {...sharedProps} />
            <Color.ColorButton color="grey" icon="font" title="Grey" {...sharedProps} />
            <Color.ColorButton color="darkgrey" icon="font" title="Dark Grey" {...sharedProps} />
          </div>
          <div className="menu">
            <Color.ColorButton color="red" icon="font" title="Red" {...sharedProps} />
            <Color.ColorButton color="yellow" icon="font" title="Yellow" {...sharedProps} />
            <Color.ColorButton color="blue" icon="font" title="Blue" {...sharedProps} />
          </div>
          <div className="menu">
            <Color.ColorButton color="male" icon="mars" title="Male" {...sharedProps} />
            <Color.ColorButton color="female" icon="venus" title="Female" {...sharedProps} />
            <Color.ColorButton color="neuter" icon="neuter" title="Neuter" {...sharedProps} />
          </div>
          <div className="menu">
            <Color.ColorButton color="dative" icon="arrows-h" title="Dative" {...sharedProps} />
            <Color.ColorButton color="accusative" icon="times" title="Accusative" {...sharedProps} />
          </div>
        </div>
        <ToolbarButton icon="keyboard-o" title="Character Map" onMouseDown={this.onClickCharacterMenu} />
        <div className="character-menu" style={{ display: this.state.displayCharacterMenu }}>
          <div className="menu">
            <Plain.PlainButton text="←" title="Left Arrow" {...sharedProps} />
            <Plain.PlainButton text="→" title="Right Arrow" {...sharedProps} />
            <Plain.PlainButton text="↔" title="Left Right Arrow" {...sharedProps} />
            <Plain.PlainButton text="⇐" title="Leftwards Double Arrow" {...sharedProps} />
            <Plain.PlainButton text="⇒" title="Rightwards Double Arrow" {...sharedProps} />
          </div>
          <div className="menu">
            <Plain.PlainButton text="…" title="Ellipsis" {...sharedProps} />
            <Plain.PlainButton text="«" title="Double Low Quote" {...sharedProps} />
            <Plain.PlainButton text="»" title="Double High Quote" {...sharedProps} />
            <Plain.PlainButton text="„" title="Double Angle Left Quote" {...sharedProps} />
            <Plain.PlainButton text="”" title="Double Angle Right Quote" {...sharedProps} />
          </div>
        </div>
        <ToolbarButton icon="reorder" title="rules" onMouseDown={this.onClickRuleMenu} />
        <div className="rule-menu menu" style={{ display: this.state.displayRuleMenu }}>
          <Void.VoidButton type="underbar" text="____" title="Small Space" {...sharedProps} />
          <Void.VoidButton type="underbar_l" text="______" title="Medium Space" {...sharedProps} />
          <Void.VoidButton type="underbar_xl" text="________" title="Large Space" {...sharedProps} />
          <Void.VoidButton type="horizontal-rule" text="———" title="Horizontal Rule" {...sharedProps} />
        </div>

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
