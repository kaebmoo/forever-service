var should = require('should');
var scriptBuilder = require('../lib/scriptBuilder');
var installer  = require('../lib/installer');
var fs = require('fs-extra');

describe('Generate sysvinit script', function(){

	describe('Test sysvinit Linux scripts', function(){

		it('should validated arguments', function(){
			
			(function(){
			  	scriptBuilder.gen();
			}).should.throw();

			//No callback
			(function(){
			  	scriptBuilder.gen({platform: 'sysvinit'});
			}).should.throw();

			//Invalid callback
			(function(){
			  	scriptBuilder.gen({platform: 'sysvinit'}, 0);
			}).should.throw();

			//All valid
			(function(){
			  	scriptBuilder.gen({platform: 'sysvinit'}, function(){});
			}).should.not.throw();
		});

		it('should generate script for sysvinit linux', function(done){
			scriptBuilder.gen(
				{
					platform: "sysvinit",
					nodescript: "app.js",
					service: "test",
					displayname:"Test service"
				},
				function(err, scripts){
					if(err) throw err;

					scripts.should.have.property('initd');	
					scripts.should.have.property('logrotate');
	
					//fs.writeFileSync('testinitd.log', scripts.initd);
					//console.log(scripts.logrotate);
					done();
				}
			);
		});

	});
});

describe("Check Environment Variable splitting", function(){

	it("Should work with single env variable", function(){
		var e = installer.splitEnvVariables('HOME=/xyz/');
		e.should.be.an.Array;
		e.should.have.length(1);
		e.should.containEql('HOME=/xyz/');
	});


	it("Should split env variables by space", function(){
		var e = installer.splitEnvVariables('z=10 x=test HOME=/xyz/');
		e.should.be.an.Array;
		e.should.have.length(3);
		e.should.containEql('z=10');
		e.should.containEql('x=test');
		e.should.containEql('HOME=/xyz/');
	});


	it("Should split env variables by space but avoid space splitting inside quote", function(){
		var e = installer.splitEnvVariables('z=10 x="test testing" HOME=/xyz/');
		e.should.be.an.Array;
		e.should.have.length(3);
		e.should.containEql('z=10');
		e.should.containEql('x="test testing"');
		e.should.containEql('HOME=/xyz/');
	});


	it("Should split env variables by space but avoid space splitting inside single quote", function(){
		var e = installer.splitEnvVariables("z=10 x='test testing' HOME=/xyz/");
		e.should.be.an.Array;
		e.should.have.length(3);
		e.should.containEql('z=10');
		e.should.containEql("x='test testing'");
		e.should.containEql('HOME=/xyz/');
	});


});


