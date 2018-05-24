function Vector(x,y,z){
    if (Number.isNaN(x+y+z)){
        Log.error("NaN in Vector! See JS console for stack trace.");
        throw new Error();
    } 
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
    this.length=function(){
        return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z);
    }
    this.normalize=function(){
        return this.div(this.length());
    }
    this.dot=function(vec){
        return this.x*vec.x+this.y*vec.y+this.z*vec.z;
    }
    this.toString=function(){
      return "("+x.toPrecision(5)+", "+y.toPrecision(5)+", "+z.toPrecision(5)+")";
    }
    this.flatten=function(){
        return new Vector(this.x,this.y,0);
    }
}