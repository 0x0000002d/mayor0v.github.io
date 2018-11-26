new WOW({ offset: 100 }).init();

$(document).ready(() => {
  $('.accordion').click(({ target }) => {
    $(target).closest('.services__item')
      .toggleClass('services__item--opened');
  });

  $('.customers__slick-slider').slick({
    vertical: true,
    infinite: true,

    slidesToShow: 2,
    slidesToScroll: 2,

    autoplay: true,
    autoplaySpeed: 2500,

    adaptiveHeight: false,

    nextArrow: $('.js-slider__nav--bottom'),
    prevArrow: $('.js-slider__nav--top'),
    responsive: [
      {
        breakpoint: 670,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  });

  const elemImg = $('.js-teammates').find('.our-team__teammate--active');
  const id = elemImg.attr('data-id');
  const elemDesc = $('.js-teammates-desc').find(`li[data-id=${id}]`);
  elemDesc.siblings().addClass('fadeOut');

  $('.js-teammates').click(event => {
    const target = $(event.target).closest('li');
    if (!target.attr('data-id')) return;

    const id = target.attr('data-id');
    const teammateDesc = $('.js-teammates-desc').find(`li[data-id=${id}]`);

    target.addClass('our-team__teammate--active');
    target.siblings().removeClass('our-team__teammate--active');

    teammateDesc.siblings().removeClass('fadeIn');
    teammateDesc.siblings().addClass('our-team__teammate-desc--close');

    teammateDesc.addClass('our-team__teammate-desc--active');
    teammateDesc.addClass('fadeIn');

    teammateDesc.removeClass('our-team__teammate-desc--close');
    teammateDesc.removeClass('fadeOut');
  });

  const modal = $('.form-modal');

  $('.js-form-modal').submit(event => {
    event.preventDefault();

    modal.addClass('form-modal--active');
  });

  $('.js-form-modal__close').click(event => {
    event.preventDefault();

    modal.removeClass('form-modal--active');
  });

  $('.js-modal-click').click(({ target }) => {
    if (!target.closest('.js-modal')) {
      modal.removeClass('form-modal--active');
    }

    return;
  });

  $('.page-header__nav-button').click(event => {
    $('.page-header .nav').toggleClass('nav--active');
  });
});
