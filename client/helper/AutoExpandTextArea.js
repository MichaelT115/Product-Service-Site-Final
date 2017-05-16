// A text area that expands its size automatically to fit the content
class AutoExpandTextArea extends React.Component {
  constructor() {
    super();

    this.updateSize = this.updateSize.bind(this);
    $(window).resize(this.updateSize);  // Update on window resize
  }

  componentWillMount() {
    // The text area must render a frame before updating.
    setTimeout(() => {
      window.requestAnimationFrame(this.updateSize)
    }, 0);
  }

  // Change the size
  updateSize() {
    const textArea = $(`#${this.props.id}`)[0];
    textArea.style.height = '0px';  // Force scroll to get scroll height
    textArea.style.height = `${textArea.scrollHeight + 5}px`;
  };

  // Render text area
  render() {
    return (
      <textarea
        id={this.props.id}
        className={this.props.className}
        type="text"
        name={this.props.name}
        defaultValue={this.props.defaultValue}
        placeholder={this.props.placeholder}
        onChange={(e) => {
          // Update while new values are entered
          this.updateSize();
          // Call the onChanged method sent in.
          this.props.onChange(e);
        }}
      />
    )
  }
}