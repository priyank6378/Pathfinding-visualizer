var main_conatiner = document.getElementsByClassName("main-container")[0];

var node_box = "<div class='node-box'></div>";

var n = Math.floor(window.innerHeight*0.8/40);
var m = Math.floor(window.innerWidth*0.96/40);

var graph = [];

var stopping_condition = false;


var nodes_div = main_conatiner.children;

var columns_size = "";
for (var i = 0 ; i<m; i++){
    columns_size += "40px ";
}
main_conatiner.style.gridTemplateColumns = columns_size;

for (var i = 0; i < n; i++) {
    var row = [];
    for (var j = 0; j < m; j++) {
        row.push(0);
        main_conatiner.innerHTML += node_box;
    }
    graph.push(row);
}

var start_node = [0, 0];
var end_node = [n - 1, m - 1];
var search_speed = 10;

var start_node_box = document.getElementsByClassName("node-box")[start_node[0] * m + start_node[1]];
var end_node_box = document.getElementsByClassName("node-box")[end_node[0] * m + end_node[1]];

start_node_box.style.backgroundColor = "green";
start_node_box.style.border = "1px solid  green";
end_node_box.style.backgroundColor = "red";
end_node_box.style.border = "1px solid red";



// control key for walls
var control_key = false;
document.addEventListener("keydown", function(e){
    if (e.keyCode == 17){
        control_key = true;
    };
});
document.addEventListener("keyup", function(e){
    if (e.keyCode == 17){
        control_key = false;
    };
});

for (var i = 0 ; i<m*n; i++){
    nodes_div[i].addEventListener("click", function(){
        var node = this;
        start_node_box.style.backgroundColor = "white";
        start_node_box.style.border = "1px solid rgba(0, 0, 0, 0.5)";
        start_node_box = node;
        start_node_box.style.border = "1px solid green";
        start_node_box.style.backgroundColor = "green";
        start_node = [Math.floor(i/m), i%m];
    });

    nodes_div[i].addEventListener("contextmenu", function(e){
        e.preventDefault();
        var node = this;
        end_node_box.style.backgroundColor = "white";
        end_node_box.style.border = "1px solid rgba(0, 0, 0, 0.5)";
        end_node_box = node;
        end_node_box.style.border = "1px solid red";
        end_node_box.style.backgroundColor = "red";
        end_node = [Math.floor(i/m), i%m];
    });

    nodes_div[i].addEventListener("mouseover", function(e){
        if (e.buttons == 1 && e.buttons != 2 && control_key == true){
            e.preventDefault();
            var node = this;
            if (node.style.backgroundColor!='green' || node.style.backgroundColor!='red')
                node.style.backgroundColor = "black";
            // graph[Math.floor(i/m)][i%m] = -1;
        }
    });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

///////////////////// ALGORITHMS ///////////////////////

///////// dfs ///////////////
async function dfs(){
    stopping_condition = false;
    await disable_buttons();
    for (var i = 0 ; i<n; i++){
        for (var j = 0 ; j<m ; j++){
            if (nodes_div[i*m+j].style.backgroundColor == 'black'){
                graph[i][j] = -1;
            }
            else if (nodes_div[i*m+j].style.backgroundColor == 'green'){
                start_node = [i, j];
            }
            else if (nodes_div[i*m+j].style.backgroundColor == 'red'){
                end_node = [i, j];
            }
            
        }
    }
    var found = false;
    var parent = [];
    for (var i = 0 ; i<n; i++){
        var row = [];
        for (var j = 0 ; j<m ; j++){
            row.push([-1, -1]);
        }
        parent.push(row);
    }
    async function _dfs(start){
        if (stopping_condition){
            return ;
        }
        if (found){
            return;
        }
        if (start[0]<0 || start[0]>=n || start[1]<0 || start[1]>=m){
            return;
        }
        if (graph[start[0]][start[1]]){
            return ;
        }
        graph[start[0]][start[1]] = 1;
        if (start[0] == end_node[0] && start[1] == end_node[1]){
            found = true;
            return ;
        }
        
        if (start!=start_node && start!=end_node) nodes_div[start[0]*m+start[1]].style.backgroundColor = "aqua";
        await sleep(search_speed);
        if (start!=start_node && start!=end_node) nodes_div[start[0]*m+start[1]].style.backgroundColor = "yellow";
        
        var neighbours = [[start[0]-1, start[1]], [start[0], start[1]+1], [start[0]+1, start[1]], [start[0], start[1]-1]];
        for (var i = 0 ; i<neighbours.length; i++){
            if (found){
                return;
            }
            await _dfs(neighbours[i]);
            if (found){
                parent[neighbours[i][0]][neighbours[i][1]] = start;
            }
        }
    }

    async function _print_path(node){
        if (found){
            var path = [];
            var curr = end_node;
            while (curr[0]!=-1){
                path.push(curr);
                curr = parent[curr[0]][curr[1]];
            }
            for (var i = path.length-1 ; i>=0 ; i--){
                if (path[i]!=start_node && path[i]!=end_node)
                nodes_div[path[i][0]*m+path[i][1]].style.backgroundColor = "blue";
                await sleep(search_speed);
            }
        }
    }

    await _dfs(start_node);
    await _print_path(end_node);

    await activate_button();
}


///////// bfs ///////////////
async function bfs(){
    stopping_condition = false;
    await disable_buttons();
    for (var i = 0 ; i<n; i++){
        for (var j = 0 ; j<m ; j++){
            if (nodes_div[i*m+j].style.backgroundColor == 'black'){
                graph[i][j] = -1;
            }
            else if (nodes_div[i*m+j].style.backgroundColor == 'green'){
                start_node = [i, j];
            }
            else if (nodes_div[i*m+j].style.backgroundColor == 'red'){
                end_node = [i, j];
            }
        }
    }
    var found = false;
    var parent = [];
    var dist = [];
    for (var i = 0 ; i<n; i++){
        var row = [];
        var row2 = [];
        for (var j = 0 ; j<m ; j++){
            row.push([-1, -1]);
            row2.push(100000);
        }
        parent.push(row);
        dist.push(row2);
    }
    async function _bfs(start){
        var queue = [];
        queue.push(start);
        dist[start[0]][start[1]] = 0;
        while (queue.length){
            if (stopping_condition){
                return ;
            }
            var curr = queue.shift();
            if (found){
                return;
            }
            if (curr[0]<0 || curr[0]>=n || curr[1]<0 || curr[1]>=m){
                continue;
            }
            if (graph[curr[0]][curr[1]]){
                continue ;
            }
            graph[curr[0]][curr[1]] = 1;
            if (curr[0] == end_node[0] && curr[1] == end_node[1]){
                found = true;
                return ;
            }

            if (curr!=start_node && curr!=end_node) nodes_div[curr[0]*m+curr[1]].style.backgroundColor = "aqua";
            await sleep(search_speed);
            if (curr!=start_node && curr!=end_node) nodes_div[curr[0]*m+curr[1]].style.backgroundColor = "yellow";
            
            var neighbours = [[curr[0]-1, curr[1]], [curr[0], curr[1]+1], [curr[0]+1, curr[1]], [curr[0], curr[1]-1]];
            for (var i = 0 ; i<neighbours.length; i++){
                if (neighbours[i][0]<0 || neighbours[i][0]>=n || neighbours[i][1]<0 || neighbours[i][1]>=m){
                    continue;
                }
                if (dist[neighbours[i][0]][neighbours[i][1]]>dist[curr[0]][curr[1]]+1){
                    dist[neighbours[i][0]][neighbours[i][1]] = dist[curr[0]][curr[1]]+1;
                    parent[neighbours[i][0]][neighbours[i][1]] = curr;
                    queue.push(neighbours[i]);
                }
                if (stopping_condition){
                    return ;
                }
            }
        }
    }

    async function _print_path(node){
        if (found){
            var path = [];
            var curr = end_node;
            while (curr[0]!=-1){
                path.push(curr);
                curr = parent[curr[0]][curr[1]];
                if (stopping_condition){
                    return ;
                }
            }
            for (var i = path.length-1 ; i>=0 ; i--){
                if (path[i]!=start_node && path[i]!=end_node)
                nodes_div[path[i][0]*m+path[i][1]].style.backgroundColor = "blue";
                await sleep(search_speed);
                if (stopping_condition){
                    return ;
                }
            }
        }
    }

    await _bfs(start_node);
    await _print_path(end_node);

    await activate_button();
}










/////////////////////////// UTILS //////////////////////////
function reset(){
    stopping_condition = true;
    for (var i = 0 ; i<n; i++){
        for (var j = 0 ; j<m ; j++){
            graph[i][j] = 0;
            if (start_node!=[i, j] && end_node!=[i, j] && nodes_div[i*m+j].style.backgroundColor!="black")
            nodes_div[i*m+j].style.backgroundColor = "white";
        }
    }
    nodes_div[start_node[0]*m+start_node[1]].style.backgroundColor = "green";
    nodes_div[end_node[0]*m+end_node[1]].style.backgroundColor = "red";
}

function clearboard(){
    stopping_condition = true;
    for (var i = 0 ; i<n; i++){
        for (var j = 0 ; j<m ; j++){
            graph[i][j] = 0;
            if (start_node!=[i, j] && end_node!=[i, j])
            nodes_div[i*m+j].style.backgroundColor = "white";
        }
    }
    nodes_div[start_node[0]*m+start_node[1]].style.backgroundColor = "green";
    nodes_div[end_node[0]*m+end_node[1]].style.backgroundColor = "red";
}

async function disable_buttons(){
    var buttons_list = document.getElementsByClassName('btn');
    var reset_button = document.getElementsByClassName('reset-btn');
    for (var i = 0 ; i<buttons_list.length ; i++){
        buttons_list[i].disabled = true;
    }
    reset_button[0].disabled = false;
}

async function activate_button(){
    var buttons_list = document.getElementsByClassName('btn');
    for (var i = 0 ; i<buttons_list.length ; i++){
        buttons_list[i].disabled = false;
    }
}

function max(a,b){
    if (a>b) return a;
    return b;
}

function set_speed(){
    search_speed = max(10,parseInt(document.getElementById("speed").value)) ;
}
