import { createStackNavigator } from 'react-navigation'
import Home from './Home'
import Profile from './Profile'
import SignInOrUp from './SignInOrUp'

const App = createStackNavigator(
  {
    Home: { screen: Home },
    Profile: { screen: Profile },
    SignInOrUp: { screen: SignInOrUp },
  },
  {
    initialRouteName: 'SignInOrUp',
    headerMode: 'none',
    mode: 'modal',
  }
)

export default App