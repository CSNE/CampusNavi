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
            /*
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
            //*/
        ],
        "edges": [
            /*
            {
                "vs": "sinchon_station",
                "ve": "yonsei_main_gate",
                "w": { "walk": 7, "run": 5 },
                "f": {},
                "undir": true
            }
            //*/
        ]
    };

    /**** test ****/
    var jsonv1 = "%5B%7B%22id%22%3A%22erp_g1%22%2C%22name%22%3A%22%uACF5%uD559%uC6D0%20%uC785%uAD6C%22%2C%22loc%22%3A%5B37.560743%2C126.936078%2C0%5D%7D%2C%7B%22id%22%3A%22byro1%22%2C%22name%22%3A%22%uACF5%uD559%uC6D0%20%uC55E%20%uBC31%uC591%uB85C%22%2C%22loc%22%3A%5B37.560568%2C126.936883%2C0%5D%7D%2C%7B%22id%22%3A%22v5%22%2C%22name%22%3A%22%uC544%uB9C8%20%uC5B8%uB355%20%uC704%22%2C%22loc%22%3A%5B37.562945%2C126.936373%2C0%5D%7D%2C%7B%22id%22%3A%22v1%22%2C%22name%22%3A%22%uC2A4%uD3EC%uCE20%20%uACFC%uD559%uAD00%20%uC55E%22%2C%22loc%22%3A%5B37.562699%2C126.935939%2C0%5D%7D%2C%7B%22id%22%3A%22byro2_2%22%2C%22name%22%3A%22%uBC31%uC591%uB85C%20%uC5B4%uB518%uAC00%202%20%uC0DB%uAE38%202%22%2C%22loc%22%3A%5B37.561304%2C126.935477%2C0%5D%7D%2C%7B%22id%22%3A%22byro2%22%2C%22name%22%3A%22%uBC31%uC591%uB85C%20%uC5B4%uB518%uAC00%202%22%2C%22loc%22%3A%5B37.561023%2C126.937001%2C0%5D%7D%2C%7B%22id%22%3A%22byro2_1%22%2C%22name%22%3A%22%uBC31%uC591%uB85C%20%uC5B4%uB518%uAC00%202%20%uC0DB%uAE38%201%22%2C%22loc%22%3A%5B37.561112%2C126.936556%2C0%5D%7D%2C%7B%22id%22%3A%22byro4%22%2C%22name%22%3A%22%uBC31%uC591%uB85C%20%uC5B4%uB518%uAC00%204%22%2C%22loc%22%3A%5B37.562686%2C126.937553%2C0%5D%7D%2C%7B%22id%22%3A%22byro4_1%22%2C%22name%22%3A%22%uBC31%uC591%uB85C%20%uC5B4%uB518%uAC00%204%20%uC0DB%uAE38%201%22%2C%22loc%22%3A%5B37.562771%2C126.937087%2C0%5D%7D%2C%7B%22id%22%3A%22byro3%22%2C%22name%22%3A%22%uC81C1%uACF5%uD559%uAD00%20%uC55E%20%uBC31%uC591%uB85C%22%2C%22loc%22%3A%5B37.561653%2C126.937215%2C0%5D%7D%2C%7B%22id%22%3A%22ena_g1%22%2C%22name%22%3A%22%uC81C1%uACF5%uD559%uAD00%20%uC785%uAD6C%22%2C%22loc%22%3A%5B37.561767%2C126.936631%2C0%5D%7D%2C%7B%22id%22%3A%22byro3_1%22%2C%22name%22%3A%22%uC81C1%uACF5%uD559%uAD00%20%uC55E%22%2C%22loc%22%3A%5B37.561755%2C126.936749%2C0%5D%7D%5D";
    var jsone1 = "%5B%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22yonsei_main_gate%22%2C%22ve%22%3A%22byro1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro1%22%2C%22ve%22%3A%22byro2%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro2%22%2C%22ve%22%3A%22byro3%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro3%22%2C%22ve%22%3A%22byro4%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro1%22%2C%22ve%22%3A%22erp_g1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro2%22%2C%22ve%22%3A%22byro2_1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro2_1%22%2C%22ve%22%3A%22byro2_2%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro3%22%2C%22ve%22%3A%22byro3_1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro3_1%22%2C%22ve%22%3A%22ena_g1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro4%22%2C%22ve%22%3A%22byro4_1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro2_2%22%2C%22ve%22%3A%22v1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22v1%22%2C%22ve%22%3A%22v5%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22v5%22%2C%22ve%22%3A%22byro4_1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro2_1%22%2C%22ve%22%3A%22byro3_1%22%7D%2C%7B%22undir%22%3Atrue%2C%22f%22%3A%7B%7D%2C%22vs%22%3A%22byro3_1%22%2C%22ve%22%3A%22byro4_1%22%7D%5D";
    var jsons = [
        "%7B%22vertices%22%3A%5B%5D%2C%22edges%22%3A%5B%5D%7D",
        "%7B%22vertices%22%3A" + jsonv1 + "%2C%22edges%22%3A" + jsone1 + "%7D",
        "%7B%22vertices%22%3A%5B%7B%22id%22%3A%22jiri%22%2C%22name%22%3A%22%uC9C0%uB9AC%uB294%20%uACF3%22%2C%22loc%22%3A%5B37.565738920891995%2C126.93468332290651%2C0%5D%7D%2C%7B%22id%22%3A%22oji%22%2C%22name%22%3A%22%uC624%uC9C0%uB294%20%uACF3%22%2C%22loc%22%3A%5B37.56220106532175%2C126.93740844726564%2C0%5D%7D%2C%7B%22id%22%3A%22dog%22%2C%22name%22%3A%22%uAC1C%uCA4C%uB294%20%uACF3%22%2C%22loc%22%3A%5B37.563561798885736%2C126.94165706634523%2C0%5D%7D%2C%7B%22id%22%3A%22black_salt_dragon%22%2C%22name%22%3A%22%uD751%uC5FC%uB8E1%22%2C%22loc%22%3A%5B37.56589199738891%2C126.93968296051027%2C0%5D%7D%2C%7B%22id%22%3A%22john_test%22%2C%22name%22%3A%22%uC874%uB098%20%uD14C%uC2A4%uD2B8%uC6A9%20vertex%22%2C%22loc%22%3A%5B37.56441224474215%2C126.93805217742921%2C0%5D%7D%2C%7B%22id%22%3A%22yonsei_main_gate%22%2C%22name%22%3A%22%uC5F0%uC138%uB300%20%uC815%uBB38%22%2C%22loc%22%3A%5B37.56012270944868%2C126.93672716617586%2C0%5D%7D%5D%2C%22edges%22%3A%5B%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22jiri%22%2C%22ve%22%3A%22oji%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%22%uC9C0%uB9AC%uB294%20%uAE38%22%3Atrue%2C%22%uC624%uC9C0%uB294%20%uAE38%22%3Atrue%7D%2C%22undir%22%3Atrue%7D%2C%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22oji%22%2C%22ve%22%3A%22dog%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%7D%2C%22undir%22%3Atrue%7D%2C%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22dog%22%2C%22ve%22%3A%22black_salt_dragon%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%7D%2C%22undir%22%3Atrue%7D%2C%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22black_salt_dragon%22%2C%22ve%22%3A%22jiri%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%7D%2C%22undir%22%3Atrue%7D%2C%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22black_salt_dragon%22%2C%22ve%22%3A%22john_test%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%7D%2C%22undir%22%3Atrue%7D%2C%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22john_test%22%2C%22ve%22%3A%22oji%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%7D%2C%22undir%22%3Atrue%7D%2C%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22john_test%22%2C%22ve%22%3A%22dog%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%7D%2C%22undir%22%3Atrue%7D%2C%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22john_test%22%2C%22ve%22%3A%22jiri%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%7D%2C%22undir%22%3Atrue%7D%2C%7B%22name%22%3A%22New%20Edge%22%2C%22vs%22%3A%22oji%22%2C%22ve%22%3A%22yonsei_main_gate%22%2C%22w%22%3Anull%2C%22f%22%3A%7B%7D%2C%22undir%22%3Atrue%7D%5D%7D"
    ];
    //

    function vpush(e)
    {
        obj.vertices.push(e);
    }
    function epush(e)
    {
        obj.edges.push(e);
    }

    function addJson(j)
    {
        //alert(unescape(j));
        var o = JSON.parse(unescape(j));
        o.vertices.forEach(vpush);
        o.edges.forEach(epush);
    }

    //obj.vertices = obj.vertices.concat(JSON.parse(unescape(jsonv1)));
    //obj.edges = obj.edges.concat(JSON.parse(unescape(jsone1)));//no w -> use distance

    jsons.forEach(addJson);

    /**** parsing ****/
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

    //Log.debug("111");

    /**** test ****/
    /*
    걷는 속도; 1
    뛰는 속도: 2
    */
    for (var i = 0; i < masterGraph.edges.length; i++)
    {
        var e = masterGraph.edges[i];
        if (!e.timeRequired)
        {
            var d = e.vStart.coordinates.getDistance(e.vEnd.coordinates);
            e.timeRequired = { "walk": d, "run": d / 2, "fly": d / 30 };
            Log.debug("<" + e.vStart.name + ", " + e.vEnd.name + ">: " + d);
        }
    }
    //

    Log.info("Geodata database created.");
    return masterGraph;
}

var createData = createDataJson;

var GraphDatabase = createData();
