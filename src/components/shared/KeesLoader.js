import React from 'react'
// import keesLogo from '../../assets/img/keesLogo.png';
import PCB_Logo from '../../assets/pcb-assets/pcblogo.png'
import { Loader } from 'semantic-ui-react'

class KeesLoader extends React.Component {
  // state = {  }
  render() {
    return (
      <>
        <div className='homepage-loader kees-loader-wrapper'>
          <div className='kees-loader'>
            <img src={PCB_Logo} alt='Logo' width={'70px'} />
            <Loader active inline='centered' />
          </div>
        </div>
      </>
    )
  }
}

export default KeesLoader
