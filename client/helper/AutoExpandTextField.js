// Text field that automatically expands with content
class AutoExpandTextField extends React.Component {
  render() {
    return (
      <input
        id={this.props.id}
        className={this.props.className}
        type="text"
        name={this.props.name}
        size={
          // Size it to the default value or the place holder value or to zero
          this.props.defaultValue ?
            this.props.defaultValue.length
            : this.props.placeholder ?
              this.props.placeholder.length
              : 0
        }
        placeholder={this.props.placeholder}
        defaultValue={this.props.defaultValue}
        onChange={(e) => {
          // Update length of text field
          e.target.size = e.target.value.length || this.props.placeholder.length;
          this.props.onChange(e);
        }}
      />
    )
  }
}