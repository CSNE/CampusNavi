function Vector(x,y,z){
    this.x=x;
    this.y=y;
    this.z=z;
    
    this.add=function(vec){
        return new Vector(this.x+vec.x,this.y+vec.y,this.z+vec.z);
    }
    this.sub=function(vec){
        return new Vector(this.x-vec.x,this.y-vec.y,this.z-vec.z);
    }
    this.mult=function(scalar){
        return new Vector(this.x*scalar,this.y*scalar,this.z*scalar);
    }
    this.div=function(scalar){
        return new Vector(this.x/scalar,this.y/scalar,this.z/scalar);
    }
    this.mag=function(){
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
    }
    this.normalize=function(){
        return this.div(this.mag());
    }
    this.dot=function(vec){
        return this.x*vec.x+this.y*vec.y+this.z*vec.z;
    }
    
}