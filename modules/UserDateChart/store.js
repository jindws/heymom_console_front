import Reflux from 'Reflux'
import Actions from './action'

class Store1 extends Reflux.Store
{
    constructor()
    {
        super();
        this.state = {
            a:1
        }
        this.listenables = [Actions];
    }

    onChangeKey() {
        console.log(111)
    }
}
export default Store1
