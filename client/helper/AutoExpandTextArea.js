class AutoExpandTextArea extends React.Component {
  constructor() {
    super();

    this.updateSize = this.updateSize.bind(this);
    $(window).resize(this.updateSize);
  }

  componentWillMount() {
    setTimeout(() => {
      window.requestAnimationFrame(this.updateSize)
    }, 0);
  }

  updateSize() {
    const textArea = $(`#${this.props.id}`)[0];
    textArea.style.height = '0px';
    textArea.style.height = `${textArea.scrollHeight + 5}px`;
  };


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
          this.updateSize();
          this.props.onChange(e);
        }}
      />
    )
  }
}