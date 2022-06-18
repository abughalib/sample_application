let nav = document.querySelector('#nav');

window.onscroll = ()=>{
	if(window.pageYOffset > 0){
		nav.classList.add('navBar-scrolled')
	}else{
		nav.classList.remove('navBar-scrolled')
	}
}