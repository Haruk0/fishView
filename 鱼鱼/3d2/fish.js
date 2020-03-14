
var gl;
var canvas;

//世界
var viewX=0;
var viewY=0;
var viewZ=10;

var lookX=0;
var lookY=0;
var lookZ=0;

var l=0.05;

var numVertices  = 36;

var texSize = 64;//128则方格变密集

// Create a checkerboard pattern using floats


var image1 = new Array()
    for (var i =0; i<texSize; i++)  image1[i] = new Array();
    for (var i =0; i<texSize; i++)
        for ( var j = 0; j < texSize; j++)
           image1[i][j] = new Float32Array(4);
    for (var i =0; i<texSize; i++) for (var j=0; j<texSize; j++) {
        var c = (((i & 0x8) == 0) ^ ((j & 0x8)  == 0));
        image1[i][j] = [c, c, c, 1];
    }

// Convert floats to ubytes for texture

var image2 = new Uint8Array(4*texSize*texSize);

    for ( var i = 0; i < texSize; i++ )
        for ( var j = 0; j < texSize; j++ )
           for(var k =0; k<4; k++)
                image2[4*texSize*i+4*j+k] = 255*image1[i][j][k];//生成花纹



var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];//格子花纹位置

var vertexColors = [
        [ 0.027, 0.71, 0.71, 1.0 ],  // 鱼嘴深蓝
        [ 0.486, 0.984, 0.984, 1.0 ],  // 鱼背深蓝
        [ 0.61, 0.984, 0.984, 1.0 ],  // 鱼背浅蓝
        [ 1.0, 1.0, 1.0, 1.0 ]   // 鱼背白
        [1.0,1.0,0,1.0]
    ];

//var theta=0;
var thetal=5;

var modelMatrix=new Matrix4();//模型矩阵
var viewMatrix=new Matrix4();//视图矩阵
var buchang=0.025;
var angle_=10;

//下为球

var rotationMatrix;
var rotationMatrixLoc;

var  angle = 0.0;
var  axis = [0, 0, 1];

var lightPosition = vec4(0.0, 1.0, 0.0, 0.0 );

var lightAmbient = vec4(0.3, 0.3, 0.3, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var bodyUpDiffuse = vec4( 0.486, 0.984, 0.984, 1.0 );
var bodyDownDiffuse= vec4(0.61, 0.984, 0.984, 1.0);
var headDiffuse = vec4(0.027, 0.71, 0.71, 1.0 );
var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var headDiffuseProduct;
var bodyDownDiffuseProduct;
var bodyUpDiffuseProduct;

var lastPos = [0, 0, 0];
var curx, cury;
var startX, startY;

var u_MVPMatrix;
	
var projMatrix;
var mvpMatrix;
var cBuffer;
var bufferId;

var texCoordsArray = [texCoord[0],texCoord[1],texCoord[3],texCoord[2],texCoord[0],texCoord[1],texCoord[3],texCoord[2],
						texCoord[0],texCoord[1],texCoord[3],texCoord[2],texCoord[0],texCoord[1],texCoord[3],texCoord[2],
						texCoord[0],texCoord[1],texCoord[3],texCoord[2],texCoord[0],texCoord[1],texCoord[3],texCoord[2]];//花纹矩阵

//身体法向量
var normals =new Float32Array
    ([
      0,0,0,
	  0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0,
      0,0,0
    ]);
//尾巴法向量
var normals2=new Float32Array
    ([
      0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,

	  0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0
    ]);
//鱼鳍法向量
var normals3=new Float32Array
    ([
      0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
    ]);
//侧鳍法向量
var normals4=new Float32Array
    ([
      0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,

	  0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0
    ]);
var normals5=new Float32Array
    ([
      0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  
	  0,0,0,
      0,0,0,
	  0,0,0,
      0,0,0,
      0,0,0,
	  0,0,0
    ]);

//身体颜色
/*var vertexColors = 
    [
    //vec4(1.0, 0.0, 0.0, 1.0),vec4(0.0, 0.1, 0.0, 1.0),vec4(0.0, 0.0, 1.0, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0)
    ];

//尾巴颜色
var vertexColors2 = 
    [
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0),vec4(0.0, 0.984, 0.984, 1.0)
    ];
//鱼鳍颜色
var vertexColors3 = 
    [
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0)
    ];
//侧鳍颜色
var vertexColors4 = 
    [
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0)
    ];
var vertexColors5 = 
    [
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
      vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0)
    ];
*/

var vertexColors =[vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0 ),
					vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),
					vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
					vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0)];


var vertexColors2 =[vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),
					vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),

					vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0),vec4( 0.027, 0.71, 0.71, 1.0)];

var vertexColors3 =[vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
					vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0)];

var vertexColors4 =[vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
					vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
					
					vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0)];

var vertexColors5 =[vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
					vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),
					
					vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0),vec4(0.61, 0.984, 0.984, 1.0)];
//身体顶点
/*
var vertices = new Float32Array([
   -0.5, 0.0, 0.0,  0.0, 0.0,0.25,  0.0,0.25, 0.0,
   -0.5, 0.0, 0.0,  0.0,0.25, 0.0,  0.0, 0.0,-0.25,
   -0.5, 0.0, 0.0,  0.0, 0.0,-0.25, 0.0,-0.25,0.0,
   -0.5, 0.0, 0.0,  0.0,-0.25,0.0,  0.0, 0.0,0.25,
    1.0, 0.0, 0.0,  0.0, 0.0,0.25,  0.0,0.25, 0.0,
    1.0, 0.0, 0.0,  0.0,0.25, 0.0,  0.0, 0.0,-0.25,
    1.0, 0.0, 0.0,  0.0, 0.0,-0.25, 0.0,-0.25,0.0,
    1.0, 0.0, 0.0,  0.0,-0.25,0.0,  0.0, 0.0,0.25
  ]);
*/
/*
var vertices = new Float32Array([
   -0.5, 0.0, 0.0,  0.0,0.25, 0.0,  0.0,0.0, 0.25,
   -0.5, 0.0, 0.0,  0.0,0.0, -0.25,  0.0, 0.25,0.0,
   -0.5, 0.0, 0.0,  0.0,-0.25,0.0, 0.0, 0.0,-0.25,
   -0.5, 0.0, 0.0,  0.0, 0.0,0.25,  0.0,-0.25,0.0,
    1.0, 0.0, 0.0,  0.0, 0.0,0.25,  0.0,0.25, 0.0,
    1.0, 0.0, 0.0,  0.0,0.25, 0.0,  0.0, 0.0,-0.25,
    1.0, 0.0, 0.0,  0.0, 0.0,-0.25, 0.0,-0.25,0.0,
    1.0, 0.0, 0.0,  0.0,-0.25,0.0,  0.0, 0.0,0.25
  ]);
*/
var vertices = new Float32Array([
	-0.5, 0.0, 0.0,  0.0,0.0, -0.25,  0.0, 0.25,0.0,
   -0.5, 0.0, 0.0,  0.0,0.25, 0.0,  0.0,0.0, 0.25,
   -0.5, 0.0, 0.0,  0.0,-0.25,0.0, 0.0, 0.0,-0.25,
   -0.5, 0.0, 0.0,  0.0, 0.0,0.25,  0.0,-0.25,0.0,
    1.0, 0.0, 0.0,  0.0, 0.0,0.25,  0.0,0.25, 0.0,
    1.0, 0.0, 0.0,  0.0,0.25, 0.0,  0.0, 0.0,-0.25,
    1.0, 0.0, 0.0,  0.0, 0.0,-0.25, 0.0,-0.25,0.0,
    1.0, 0.0, 0.0,  0.0,-0.25,0.0,  0.0, 0.0,0.25
  ]);
//尾巴顶点
var vertices2 = new Float32Array([
	1.0, 0.0, 0.0,  1.125,0.125, 0.0,  1.125, 0.0,0.125, 
    1.0, 0.0, 0.0,  1.125, 0.0,-0.125, 1.125,0.125, 0.0,  
    1.0, 0.0, 0.0,  1.125,-0.125,0.0,  1.125, 0.0,-0.125, 
    1.0, 0.0, 0.0,  1.125, 0.0,0.125,  1.125,-0.125,0.0,

	1.125,0.0,0.125,  1.125,0.125,0.0,  1.125,0.0,-0.125,
	1.125,0.0,0.125,  1.125,0.0,-0.125,  1.125,-0.125,0.0
]);
//鱼鳍顶点
var vertices3 = new Float32Array([
    0.11, 0.40, -0.05, 0.11, 0.40, 0.05,   0.0, 0.25, 0.0,
	0.11, 0.40, 0.05,  0.5,  0.125, 0.0,   0.0, 0.25, 0.0,
	0.11, 0.40,-0.05,  0.0, 0.25, 0.0,     0.5,  0.125, 0.0,
	0.11, 0.40, 0.05,  0.11, 0.40,-0.05,   0.5, 0.125, 0.0
]);
//侧鳍顶点
var vertices4 = new Float32Array([
	0.0, 0.0, 0.25, 0.125, 0.0, 0.375, 0.0, 0.125, 0.375,
	0.0, 0.0, 0.25, 0.0, 0.125, 0.375, -0.125, 0.0, 0.375, 
	0.0, 0.0, 0.25, -0.125, 0.0, 0.375, 0.0, -0.125, 0.375,
	0.0, 0.0, 0.25, 0.0, -0.125, 0.375,0.125, 0.0, 0.375,

	-0.125,0.0,0.375,  0.0,0.125,0.375,  0.125,0.0,0.375,
	-0.125,0.0,0.375,  0.125,0.0,0.375,  0.0,-0.125,0.375
]);
var vertices5 = new Float32Array([
	0.0, 0.0, -0.25,  0.0, 0.125, -0.375,  0.125, 0.0, -0.375,   
	0.0, 0.0, -0.25,  -0.125, 0.0, -0.375, 0.0, 0.125, -0.375,    
	0.0, 0.0, -0.25,  0.0, -0.125, -0.375, -0.125, 0.0, -0.375,
	0.0, 0.0, -0.25,  0.125, 0.0, -0.375,  0.0, -0.125, -0.375,

	0.125,0.0,-0.375,  0.0,0.125,-0.375,  -0.125,0.0,-0.375,
	0.125,0.0,-0.375,  -0.125,0.0,-0.375,  0.0,-0.125,-0.375
]);

function configureTexture(image) {
    var texture = gl.createTexture();
    gl.activeTexture( gl.TEXTURE0 );
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSize, texSize, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}//画格子

function calculateNormal()
{
    var count = 0;
    for(var i=0;i<normals.length;i+=9)
    {
     var temp1=new vec3(vertices[i+3]-vertices[i],vertices[i+4]-vertices[i+1],vertices[i+5]-vertices[i+2]);
     var temp2=new vec3(vertices[i+6]-vertices[i],vertices[i+7]-vertices[i+1],vertices[i+8]-vertices[i+2]);
     var normal = normalize(cross(temp1, temp2));
     normals[count]=normal[0];
     count++;
     normals[count]=normal[1];
     count++;
     normals[count]=normal[2];
     count++;

	 normals[count]=normal[0];
     count++;
     normals[count]=normal[1];
     count++;
     normals[count]=normal[2];
     count++;

	 normals[count]=normal[0];
     count++;
     normals[count]=normal[1];
     count++;
     normals[count]=normal[2];
     count++;
    }
    count=0;
    for(var i=0;i<normals2.length;i+=9)
    {
     var temp1=new vec3(vertices2[i+3]-vertices2[i],vertices2[i+4]-vertices2[i+1],vertices2[i+5]-vertices2[i+2]);
     var temp2=new vec3(vertices2[i+6]-vertices2[i],vertices2[i+7]-vertices2[i+1],vertices2[i+8]-vertices2[i+2]);
     var normal = normalize(cross(temp1, temp2));
     normals2[count]=normal[0];
     count++;
     normals2[count]=normal[1];
     count++;
     normals2[count]=normal[2];
     count++;

	 normals2[count]=normal[0];
     count++;
     normals2[count]=normal[1];
     count++;
     normals2[count]=normal[2];
     count++;

	 normals2[count]=normal[0];
     count++;
     normals2[count]=normal[1];
     count++;
     normals2[count]=normal[2];
     count++;
    }

    count=0;
    for(var i=0;i<normals3.length;i+=9)
    {
     var temp1=new vec3(vertices3[i+3]-vertices3[i],vertices3[i+4]-vertices3[i+1],vertices3[i+5]-vertices3[i+2]);
     var temp2=new vec3(vertices3[i+6]-vertices3[i],vertices3[i+7]-vertices3[i+1],vertices3[i+8]-vertices3[i+2]);
     var normal = normalize(cross(temp1, temp2));
     normals3[count]=normal[0];
     count++;
     normals3[count]=normal[1];
     count++;
     normals3[count]=normal[2];
     count++;

	 normals3[count]=normal[0];
     count++;
     normals3[count]=normal[1];
     count++;
     normals3[count]=normal[2];
     count++;

	 normals3[count]=normal[0];
     count++;
     normals3[count]=normal[1];
     count++;
     normals3[count]=normal[2];
     count++;
    }

    count=0;
    for(var i=0;i<normals4.length;i+=9)
    {
     var temp1=new vec3(vertices4[i+3]-vertices4[i],vertices4[i+4]-vertices4[i+1],vertices4[i+5]-vertices4[i+2]);
     var temp2=new vec3(vertices4[i+6]-vertices4[i],vertices4[i+7]-vertices4[i+1],vertices4[i+8]-vertices4[i+2]);
     var normal = normalize(cross(temp1, temp2));
     normals4[count]=normal[0];
     count++;
     normals4[count]=normal[1];
     count++;
     normals4[count]=normal[2];
     count++;

	 normals4[count]=normal[0];
     count++;
     normals4[count]=normal[1];
     count++;
     normals4[count]=normal[2];
     count++;

	 normals4[count]=normal[0];
     count++;
     normals4[count]=normal[1];
     count++;
     normals4[count]=normal[2];
     count++;
    }

    count=0;
    for(var i=0;i<normals5.length;i+=9)
    {
     var temp1=new vec3(vertices5[i+3]-vertices5[i],vertices5[i+4]-vertices5[i+1],vertices5[i+5]-vertices5[i+2]);
     var temp2=new vec3(vertices5[i+6]-vertices5[i],vertices5[i+7]-vertices5[i+1],vertices5[i+8]-vertices5[i+2]);
     var normal = normalize(cross(temp1, temp2));
     normals5[count]=normal[0];
     count++;
     normals5[count]=normal[1];
     count++;
     normals5[count]=normal[2];
     count++;

	 normals5[count]=normal[0];
     count++;
     normals5[count]=normal[1];
     count++;
     normals5[count]=normal[2];
     count++;

	 normals5[count]=normal[0];
     count++;
     normals5[count]=normal[1];
     count++;
     normals5[count]=normal[2];
     count++;
    }

console.log(normals);
console.log(normals2);
console.log(normals3);
console.log(normals4);
console.log(normals5);
    //fillColors();
}

function fillColors()
{
    for(var i=0;i<vertexType.length;i+=4)
    {
        vertexType[i]=bodyDownDiffuseProduct[0];
        vertexType[i+1]=bodyDownDiffuseProduct[1];
        vertexType[i+2]=bodyDownDiffuseProduct[2];
        vertexType[i+3]=bodyDownDiffuseProduct[3];
    }

     for(var i=0;i<vertexType2.length;i+=4)
    {
        vertexType2[i]=headDiffuseProduct[0];
        vertexType2[i+1]=headDiffuseProduct[1];
        vertexType2[i+2]=headDiffuseProduct[2];
        vertexType2[i+3]=headDiffuseProduct[3];
    }

     for(var i=0;i<vertexType3.length;i+=4)
    {
        vertexType3[i]=headDiffuseProduct[0];
        vertexType3[i+1]=headDiffuseProduct[1];
        vertexType3[i+2]=headDiffuseProduct[2];
        vertexType3[i+3]=headDiffuseProduct[3];
    }

     for(var i=0;i<vertexType4.length;i+=4)
    {
        vertexType4[i]=bodyUpDiffuseProduct[0];
        vertexType4[i+1]=bodyUpDiffuseProduct[1];
        vertexType4[i+2]=bodyUpDiffuseProduct[2];
        vertexType4[i+3]=bodyUpDiffuseProduct[3];
    }

    for(var i=0;i<vertexType5.length;i+=4)
    {
        vertexType5[i]=bodyUpDiffuseProduct[0];
        vertexType5[i+1]=bodyUpDiffuseProduct[1];
        vertexType5[i+2]=bodyUpDiffuseProduct[2];
        vertexType5[i+3]=bodyUpDiffuseProduct[3];
    }
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );//选取画布
    gl = WebGLUtils.setupWebGL( canvas );//gl
	if ( !gl ) { alert( "WebGL isn't available" ); }//提示
	gl.viewport( 0, 0, canvas.width, canvas.height );//画布大小
    program = initShaders( gl, "vertex-shader", "fragment-shader" );//初始化两个着色器
    gl.useProgram( program );//使用着色器附加程序
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );//画布
	gl.clear( gl.COLOR_BUFFER_BIT |gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	configureTexture(image2);//绘制纹理

    headDiffuseProduct = mult(lightDiffuse, headDiffuse);
    bodyDownDiffuseProduct=mult(lightDiffuse,bodyDownDiffuse);
    bodyUpDiffuseProduct=mult(lightDiffuse,bodyUpDiffuse);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var specularProduct = mult(lightSpecular, materialSpecular);

    calculateNormal();

    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "bodyUpDiffuseProduct"),flatten(bodyUpDiffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "bodyDownDiffuseProduct"),flatten(bodyDownDiffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "headDiffuseProduct"),flatten(headDiffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    //gl.uniform4fv( gl.getUniformLocation(program,
    //   "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),materialShininess );

	modelMatrix.setIdentity();
	viewMatrix.setLookAt(0,0,10,0,0,0,0,1,0);
	render();
	document.getElementById("sliderx").onchange = function(event) {
        var temp = parseInt(event.target.value);
		lightPosition[0]=temp/10;
		console.log(lightPosition[0]);
		render();}
	document.getElementById("slidery").onchange = function(event) {
        var temp = parseInt(event.target.value);
		lightPosition[1]=temp/10;
		console.log(lightPosition[1]);
		render();}
	document.getElementById("sliderz").onchange = function(event) {
        var temp = parseInt(event.target.value);
		lightPosition[2]=temp/10;
		console.log(lightPosition[2]);
		render();}
	//键盘交互
	document.onkeydown=function(event){
        var key = String.fromCharCode(event.keyCode);
        switch(key) {
		//自身坐标轴
		//平移变换
		 case 'A':
         case 'a':viewX-=0.05;viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);render();//下
			break;

         case 'D':
         case 'd':viewX+=0.05;viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);render();//右
            break;

         case 'W':
		 case 'w':viewY+=0.05;viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);render();//上
         	break;

         case 'S':
         case 's':viewY-=0.05;viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);render();//左
         	break;

		 case 'E':
		 case 'e':viewZ+=0.05;viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);render();
         	break;

         case 'Q':
         case 'q':viewZ-=0.05;viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);render();
         	break;

		 //世界坐标轴
		 //平移

         case 'J':
         case 'j':lookX-=0.05;
                  viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);//console.log(lookX-Math.sin(zhuanjiao)*zhuantoubanjing,lookY,lookZ+zhuantoubanjing-Math.cos(zhuanjiao)*zhuantoubanjing);
                  render();
            break;

        case 'l':
        case 'L':lookX+=0.05;
                 viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);//console.log(lookX-Math.sin(zhuanjiao)*zhuantoubanjing,lookY,lookZ+zhuantoubanjing-Math.cos(zhuanjiao)*zhuantoubanjing);
                 render();
            break;


        case 'i':
        case 'I':
                lookY+=0.05;
                viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);
                 render();
            break;

        case 'k':
        case 'K':
                lookY-=0.05;
                viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);
                 render();
            break;

        case 'u':
        case 'U':
                lookZ-=0.05;
                viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);
                 render();
            break;

        case 'O':
        case 'o':
                lookZ+=0.05;
                viewMatrix.setLookAt(viewX,viewY,viewZ,lookX,lookY,lookZ,0,1,0);
                 render();
            break;

		}
	}

}

function render() {

	gl.clear( gl.COLOR_BUFFER_BIT |gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);

	 u_MVPMatrix=gl.getUniformLocation(program, "u_MVPMatrix");
	
	 projMatrix=new Matrix4();
	 mvpMatrix=new Matrix4();
	projMatrix.setPerspective(20,canvas.width/canvas.height,1,100);

	mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
	gl.uniformMatrix4fv(u_MVPMatrix,false,mvpMatrix.elements);
    
     cBuffer = gl.createBuffer();//顶点材质类型缓冲区
     nBuffer = gl.createBuffer();//法向量缓冲区
	 bufferId = gl.createBuffer();//顶点缓冲区
	 tBuffer = gl.createBuffer();//花纹缓冲区

	var lightPositionLoc = gl.getAttribLocation(program, "lightPosition"); 
	gl.vertexAttrib4f(lightPositionLoc, lightPosition[0],lightPosition[1],lightPosition[2], lightPosition[3]);


	//设置身体
	//颜色
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
    vColor = gl.getAttribLocation(program, "a_Color");                       
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
	//法向量

	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    var vNormal = gl.getAttribLocation(program, "normal");                       
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
	
	//顶点
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "a_Position" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 24 );
	
	//花纹缓冲区
	gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

	//设置尾巴
	//颜色
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors2), gl.STATIC_DRAW);
    vColor = gl.getAttribLocation(program, "a_Color");                       
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
	
    //法向量
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals2, gl.STATIC_DRAW);
    var vNormal = gl.getAttribLocation(program, "normal");                       
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
	
	//顶点
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER,vertices2, gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "a_Position" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 12+6 );

	//设置鱼鳍
	//颜色
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors3), gl.STATIC_DRAW);
    vColor = gl.getAttribLocation(program, "a_Color");                       
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
	//法向量
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals3, gl.STATIC_DRAW);
    var vNormal = gl.getAttribLocation(program, "normal");                       
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
	
	//顶点
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER,vertices3, gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "a_Position" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 12 );

	//设置侧鳍
	//颜色
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors4), gl.STATIC_DRAW);
    vColor = gl.getAttribLocation(program, "a_Color");                       
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
	//法向量
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals4, gl.STATIC_DRAW);
    var vNormal = gl.getAttribLocation(program, "normal");                       
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
	
	//顶点
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER,vertices4, gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "a_Position" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 12+6 );
	//颜色
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors5), gl.STATIC_DRAW);
    vColor = gl.getAttribLocation(program, "a_Color");                       
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
    
	//法向量
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals5, gl.STATIC_DRAW);
    var vNormal = gl.getAttribLocation(program, "normal");                       
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
	
	//顶点
	gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
	gl.bufferData( gl.ARRAY_BUFFER,vertices5, gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "a_Position" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 12+6 );

}
