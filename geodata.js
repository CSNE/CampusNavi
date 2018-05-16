// 지도상 데이터를 저장하는 파일.
// 이런 것에는 자바스크립트가 아니라 제대로 된
// 데이터베이스를 쓰는 것이 맞지만,
// 데이터 양이 크지 않기 때문에
// 자바스크립트 파일로 저장함.
    
function createData1(){
  var masterGraph=new Graph();

  //지점 추가
  var shinchonStation=new Vertex(37.55537,126.93687,0);
  shinchonStation.name="신촌역";
  masterGraph.addVertex(shinchonStation);

  var yonseiMainGate=new Vertex(37.56018,126.93689,0);
  yonseiMainGate.name="연세대 정문";
  masterGraph.addVertex(yonseiMainGate);

  // 간선 추가
  // 아래는 신촌역과 연세대 정문을 잇는 연세로 거리임.
  var shinchonStation_yonseiMainGate=new Edge(shinchonStation,yonseiMainGate);
  shinchonStation_yonseiMainGate.timeRequired.walk=7; //신촌역 -> 연대정문
  shinchonStation_yonseiMainGate.timeRequired.run=5; //신촌역 -> 연대정문 (뛸때)
  shinchonStation_yonseiMainGate.timeRequired.walkR=7; //연대정문 -> 신촌역
  shinchonStation_yonseiMainGate.timeRequired.runR=5; //연대정문 -> 신촌역 (뛸때)
  shinchonStation_yonseiMainGate.name="연세로"
  masterGraph.addEdge(shinchonStation_yonseiMainGate);



  Log.info("Geodata database created.");
  return masterGraph;
};


function createDataXml()
{
    //
}

function createDataJson()
{
    var masterGraph = new Graph();

    /*
    var json = '{ "vertices": [], "edges": [] }';

    var obj = JSON.parse(json);
    //*/
    var obj = {
        "vertices": [
            {
                "id": "sinchon_station",
                "name": "신촌역",
                "loc": [37.55537, 126.93687, 0]
            },
            {
                "id": "yonsei_main_gate",
                "name": "연세대 정문",
                "loc": [37.56018, 126.93689, 0]
            }
        ],
        "edges": [
            {
                "vs": "sinchon_station",
                "ve": "yonsei_main_gate",
                "w": { "walk": 7, "run": 5 },
                "f": {},
                "undir": 1
            }
        ]
    };

    var v_by_id = {};

    for (var i = 0; i < obj.vertices.length; i++)
    {
        var v = obj.vertices[i];
        var vo = new Vertex(v.loc[0], v.loc[1], v.loc[2]);
        vo.name = v.name;
        v_by_id[v.id] = vo;
        masterGraph.addVertex(vo);
    }

    for (var i = 0; i < obj.edges.length; i++)
    {
        var e = obj.edges[i];
        var eo = new Edge(v_by_id[e.vs], v_by_id[e.ve]);
        eo.name = e.name;
        eo.timeRequired = e.w;
        eo.flags = e.f;
        masterGraph.addEdge(eo);
        if (e.undir)
        {
            eo = new Edge(v_by_id[e.ve], v_by_id[e.vs]);
            eo.name = e.name;
            eo.timeRequired = e.w;
            eo.flags = e.f;
            masterGraph.addEdge(eo);
        }
    }


    Log.info("Geodata database created.");
    return masterGraph;
}

var createData = createDataXml;

var GraphDatabase = createData();
