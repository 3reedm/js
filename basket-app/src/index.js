import React from "react";
import ReactDOM	from "react-dom";
import "./index.css";


// ========================================

// Точка входа. Принимает данные извне, отвечает за текущее состояние системы
class App extends React.Component {
	constructor(props) {
		super(props);

		const currentNew = 0;
		this.state = {      // предполагается, что все данные могут изменяться на лету
			current: currentNew,
			history: this.props.data.history,
			basket: this.props.data.history[currentNew].basket,
			products: this.props.data.history[currentNew].products,
      coupons: this.props.data.history[currentNew].coupons
		};

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(param) {
    const i = param.i, k = param.k, m = param.m; // i - класс объекта, k - тип кнопки, m - тип продукта 
		if (i === 0) {
			let currentNew;
			let currentHistorySize = this.state.history.length;

			if (k === 0) {
				currentNew = k;
			}
			else if (k === 1 || k === -1) {
				currentNew = this.state.current + k;
			}
			else {
				return;
			}

			if (currentNew < 0 || currentNew >= currentHistorySize) {
				return;
			}
			else {
				this.setState({
					current: currentNew,
					basket: this.props.data.history[currentNew].basket,
					products: this.props.data.history[currentNew].products
				});
			}
		}
		else if (i === 1) {
			let currentNew = this.state.current + 1;
			let currentNewBasket;
			if (k === -1) {
			  currentNewBasket = this.state.basket.slice(0, this.state.basket.length-1);
			}
			else {
				return;
			}
			let currentNewHistory = this.state.history;
			let currentNewProducts = this.state.products;
			currentNewHistory.push({'basket': currentNewBasket, 'products': currentNewProducts});

			this.setState({
				history: currentNewHistory,
				current: currentNew,
				basket: currentNewBasket,
			});
		}
		else if (i === 2) {
			let currentNew = this.state.current + 1;
			let currentNewBasket, currentNewProduct;
      let length = this.state.basket.length;
      let index = -1;
      let j, colls;
      
      for (j = 0; j < length; ++j) {
        if (this.state.basket[j].id === m) {
          index = j;
          break;
        }
      }
      
			if (k === 1) {        
        currentNewBasket = this.state.basket.slice();
        if (index !== -1) {
          currentNewBasket[index].colls += 1;         
        }
        else {
          currentNewProduct = Object.create(this.state.products[m-1]);
          currentNewBasket.push(currentNewProduct);
        }
			}
			else if (k === -1) {
        currentNewBasket = this.state.basket.slice();
        colls = currentNewBasket[index].colls;
        
        if (colls === 1) {
          currentNewBasket.splice(index, 1);
        }
        else {
          currentNewBasket[index].colls -= 1;
        }
			}
			else {
				return;
			}
			let currentNewHistory = this.state.history;
			let currentNewProducts = this.state.products;
			currentNewHistory.push({'basket': currentNewBasket, 'products': currentNewProducts});

			this.setState({
				history: currentNewHistory,
				current: currentNew,
				basket: currentNewBasket,
			});
		}
	}

	renderElement(param) {
    const i = param.i;
		if (i === 0) {
			const menuOptions = (
				<div>
					<Button className="control-button" sign="↶" onClick={() => this.handleClick({i, k: -1})}/>
					<Button className="control-button" sign="↺" onClick={() => this.handleClick({i, k: 0})}/>
					<Button className="control-button" sign="↷" onClick={() => this.handleClick({i, k: 1})}/>
				</div>
			);

			return (<Menu options={menuOptions}/>);
		}
		else if (i === 1) {
			const basketProductsList = (this.state.basket.map((item) =>
				(
					<div key={item.id.toString()}>
						<Product item={item} onClick={() => this.handleClick({i, k: 1, m: item.id})}/>
						<Button className="control-button" sign="x" onClick={() => this.handleClick({i, k: -1, m: item.id})}/>
					</div>
				)
			));

			return (<Basket products={basketProductsList}/>);
		}
		else if (i === 2) {
			const productsList = (this.state.products.map((item) =>
				(
					<div key={item.id.toString()}>
						<Button className="control-button" sign="-" onClick={() => this.handleClick({i, k: -1, m: item.id})}/>
						<Product item={item} onClick={() => this.handleClick({i, k: 1, m: item.id})}/>
						<Button className="control-button" sign="+" onClick={() => this.handleClick({i, k: 1, m: item.id})}/>
					</div>
				)
			));

			return (<ProductPane products={productsList}/>);
		}
    else if (i === 3) {
      let total = 0;
			const checkProductsList = (this.state.basket.map((item) => { 
        item.cost = item.price * item.colls;
        total += item.cost; 
        
        return (
					<div key={item.id.toString()}>
						<Product item={item}/>
					</div>
        );
      }));

			return (<Check total={total} products={checkProductsList}/>);
		}
		else {
			return;
		}
	}

  render() {
    return (
      <div className="app">
				<h1>{this.props.data.title}</h1>
				<div className="menu">{this.renderElement({i: 0})}</div>
        <div className="product-pane">{this.renderElement({i: 2})}</div>
				<div className="basket">{this.renderElement({i: 1})}</div>
        <div className="check">{this.renderElement({i: 3})}</div>
      </div>
    );
  }
}

// Выводит текущий список выбранных товаров пользователем
class Basket extends React.Component {
  render() {
    return (
      <div className="current-products">
        {this.props.products}
      </div>
    );
  }
}

// Купон на скидку
class Coupon extends React.Component {
  render() {
    return (
      <div className="coupon">
        {this.props.products}
      </div>
    );
  }
}

// Печать чека
class Check extends React.Component { 
  render() {
    return (
      <div className="check-lists">
        {this.props.products}
        <br/>Итого: <span>{this.props.total}</span>
      </div>
    );
  }
}

// Выводит весь список товаров, доступных в системе
class ProductPane extends React.Component {
  render() {
    return (
      <div className="products">
        {this.props.products}
      </div>
    );
  }
}

// Выводит кнопки управления, для работы со списком товаров
class Menu extends React.Component {
  render() {
    return (
      <div className="menu-options">
  			{this.props.options}
      </div>
    );
  }
}

// Выводит описание определённого товара
class Product extends React.Component {
  render() {
    return (
      <div className="product">
        <div className="product-info" onClick={() => this.props.onClick()}>
					<span>{this.props.item.info}, {this.props.item.price} руб., {this.props.item.colls}</span>
        </div>
      </div>
    );
  }
}

// Выводит определённый элемент управления
class Button extends React.Component {
  render() {
    return (
      <button className={this.props.className} onClick={() => this.props.onClick()}>
				{this.props.sign}
      </button>
    );
  }
}


// ========================================

let title = "User's product basket";
let basket = [];
let coupons = [{dis: 20, timeout: new Date()}];
let products = [{id: 1, info: "Miss", price: 30, colls: 1},{id: 2, info: "Goal", price: 50, colls: 1}];
let history = [{basket, products, coupons}];
let data = {title, history};

ReactDOM.render(
  <App data={data}/>,
  document.getElementById('root')
);
