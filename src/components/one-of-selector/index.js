import React, { Component } from 'react';

class OneOfSelector extends Component {

  constructor(props) {
    super(props);    
    this.onModeChange = this.onModeChange.bind(this);
    this.oneOfChange = this.oneOfChange.bind(this);
    this.selectOneOfComponent = this.selectOneOfComponent.bind(this);
    this.onChanged = this.onChanged.bind(this);
  }

  onModeChange(e){
    let changedState = {
      manualMode: e.target.dataset.name === 'MANUAL' 
    };

    this.onChanged(changedState);
  }

  oneOfChange(e, id){
    var {selectedOneOfOptions} = this.props;
    selectedOneOfOptions[id] = parseInt(e.target.value);

    this.setState(selectedOneOfOptions);
    
    let changedState = {
      selectedOneOfOptions: selectedOneOfOptions,
    };

    this.onChanged(changedState);
  }

  onChanged(changedState){
    const { onSelectedOneOfOptionChanged } = this.props;
    onSelectedOneOfOptionChanged(changedState);
  }
  
  selectOneOfComponent(attributePath, options, defaultOption) {
    if(options){
      return (
        <div key={"OneOf" + attributePath} style={{padding: '0 0 10px 0'}} className={ "content-type-wrapper "}>
            <div>
                <label htmlFor={attributePath}>Choose one of {attributePath}:</label>
            </div>
            <select
                className="content-type" 
                name={attributePath} 
                value={defaultOption}  
                onChange = {(e) => this.oneOfChange(e, attributePath)}
              >
              <option key={'empty' } value={ '-1' }>{ '<empty>' }</option>
              { Object.keys(options).map((key, index) => {
                  return <option key={index + key} value={ index }>{ options[key] }</option>
              })}
            </select>
        </div>
      )
    }
    return null;
  }

  render() {

    const {manualMode, oneOfOptions} = this.props;
    var oneOfComponents = [];
    if (oneOfOptions){
      oneOfOptions.map((attribute)=> {
        oneOfComponents.push( this.selectOneOfComponent(attribute.key, attribute.options, attribute.defaultIndex ));
        return true;
      });
    }
  /*  
  <li className={ "tabitem" + ( manualMode ? "" : " active") }>
    <button className={'tablinks'} onClick={() => this.setState({manualMode: true}) }>first 'oneOf' item</button>
  </li>
  <li className={ "tabitem" + ( manualMode ? " active" : "") }>
    <button className={'tablinks'} onClick={() => this.setState({manualMode: false}) }>first 'oneOf' item</button>
  </li>
  */
    return (
      <div>
          <ul className="oneOfOptions tab" style={{}}>Example Value shows:&nbsp;&nbsp;&nbsp;
              <li className={ "tabitem" + ( manualMode ? "" : " active") }>
                  <a className="tablinks" data-name="FIRST" onClick={ this.onModeChange } >first 'oneOf' item</a>
              </li>
              <li className={ "tabitem" + ( manualMode ? " active" : "") }>
                  <a className= "tablinks" data-name="MANUAL" onClick={ this.onModeChange } >manually selected 'oneOf' item</a>
              </li>
          </ul>
          { oneOfComponents }
      </div>
    );
  }
}

export default OneOfSelector;