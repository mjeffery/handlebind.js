require.config({
    baseUrl: "file:///C:/Users/dnelson/workspace/handlebind.js/js/",
    shim: {
		'lib/underscore': {
			deps: [],
			exports: '_'
		},
		'lib/jquery': {
			deps: [],
			exports: '$'
		},
		'lib/handlebars': {
			deps: [],
			exports: 'Handlebars'
		}
	}
});

require(['util/BaseObject'], function(BaseObject) {

describe("A BaseObject", function() {
  
  //Simple Examples
  var propertyObject, methodObject, constructorObject;

  //Complex Objects
  var CubeObject, LivingCubeObject, HumanCubeObject, WorkerCubeObject;
  
  //Complex Instances
  var cubeInstance, livingCubeInstance, humanCubeInstance, workerCubeInstance;
  
  
  beforeEach(function(){
  	
  	propertyObject = BaseObject.extend({name: 'BaseObject'});
  	
  	methodObject = BaseObject.extend({getOne: function(){return 1}})
  	
  	CubeObject = BaseObject.extend({
  		x: 0,
  		y: 0,
  		z: 0,
  		size: 0,
  		
  		init: function(position, size){
  			this._super();
  			this.setPosition(position.x, position.y, position.z);
  			this.setSize(size);
  		},
  		
  		setPosition: function(x,y,z){
  			this.x = x;
  			this.y = y;
  			this.z = z;
  		},
  		
  		getPosition: function(){
  			return {'x':x,'y':y,'z':z}
  		},
  		
  		setSize: function(size){
  			this.size = size;
  		},
  		
  		getSize: function(){
  			return this.size;
  		}
  	});
  	
    cubeInstance = CubeObject.create({x:1,y:1,z:1}, 5);
  	
  });
	
  it("can create instances of itself", function() {
    expect(BaseObject.create({}) instanceof BaseObject).toBe(true);
  });

  it("can be extended")


});

});