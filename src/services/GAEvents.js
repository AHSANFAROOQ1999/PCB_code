
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
   'someKey': 'someValue'
})

// Measuring Product Clicks
export function productClicks (productObj) {

  // window.dataLayer = window.dataLayer || [];
  
  
  window.dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
  window.dataLayer.push({
    'event': 'productClick',
    'ecommerce': {
      'click': {
        // 'actionField': {'list': 'Search Results'},      // Optional list property.
        'products': [{
          'name': productObj.name,                      // Name or ID is required.
          'id': productObj.id,
          'price': productObj.price,
          'brand': productObj.brand,
          'category': productObj.cat,
          'variant': productObj.variant,
          'position': productObj.position
         }]
       }
     }
    //  ,
    //  'eventCallback': function() {
    //    document.location = productObj.url
    //  }
  });
}