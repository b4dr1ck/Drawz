"use strict"

function Drawz(wrapper_id,width,height,css) {
    
    var canvas = document.createElement("canvas");
    var canvas_wrapper = document.getElementById(wrapper_id);
    var frame = canvas.getContext("2d");
    canvas.setAttribute("width",width);
    canvas.setAttribute("height",height);
    if (css) { canvas.setAttribute("style",css); }
    canvas_wrapper.appendChild(canvas);
    
    this.clear = clear;
    this.create_style = create_style;
    this.draw_rect = draw_rect;
    this.draw_triang = draw_triang;
    this.draw_circle = draw_circle;
    this.draw_line = draw_line;
    
    
    function create_style(fill_color, stroke_width, stroke_color,gradient,rotation)
    {
        var style_config = 
        {
            "fill_color"        : fill_color,
            "stroke_width"      : stroke_width,
            "stroke_color"      : stroke_color,
            "gradient"          : gradient,
            "rotation"          : rotation
        }
        
        return style_config;
    }
    
    function clear() 
    { 
        frame.clearRect(0,0,width,height)
    }
    
    
    function draw_line(path,close_path,style)
    {
        var width = 0;
        var height = 0;
        var x = 0;
        var y = 0;
        for (var i=0; i < path.length; i++) {
            width=Math.max(width,path[i][0])
            height=Math.max(height,path[i][1])
        }
        x=width;
        y=height;
        for (var i=0; i < path.length; i++) {
            x=Math.min(x,path[i][0])
            y=Math.min(y,path[i][1])
        }
        
        frame.beginPath();
        
        if (style && style.rotation) {
            frame.save();
            frame.translate(x+((width-x)/2),y+((height-y)/2));
            frame.rotate(style.rotation * Math.PI / 180);
            frame.translate(-(x+((width-x)/2)),-(y+((height-y)/2)))
        }
        
        frame.moveTo(path[0][0],path[0][1]);
        for (var i=1; i < path.length; i++) {
            frame.lineTo(path[i][0],path[i][1])
        }
        
        if (close_path) {
            frame.closePath();
        }
           
        style_me(x,y,width-x,height-y,style);
        
        if (style && style.rotation) {frame.restore();}
    }
    
    function draw_circle(x,y,r,style)
    {
        frame.beginPath();
        frame.arc(x,y,r,0,2*Math.PI)
        
        style_me(x-r,y-r,r*2,r*2,style);
    }
    
    function draw_triang(x,y,width,height,style) 
    {        
        frame.beginPath();
        if (style && style.rotation) {
            frame.save();
            frame.translate(x+(width/2), y-(height/2));
            frame.rotate(style.rotation * Math.PI / 180);
            frame.translate(-(x+(width/2)), -(y-(height/2)));
        }
        
        frame.moveTo(x, y);
        frame.lineTo(x + width / 2, y - height);
        frame.lineTo(x + width, y);
        frame.lineTo(x, y);
        frame.closePath();
        
        style_me(x,y,width,height,style);
        
        if (style && style.rotation) {frame.restore();}
    }
    
    function draw_rect(x,y,width,height,style) 
    {        
        frame.beginPath();

        if (style && style.rotation) {
            frame.save();
            frame.translate(x+(width/2),y+(height/2));
            frame.rotate(style.rotation * Math.PI / 180);
            frame.translate(-(x+(width/2)),-(y+(height/2)));
        } 
        
        frame.moveTo(x, y);
        frame.lineTo(x + width, y);
        frame.lineTo(x + width, y + height);
        frame.lineTo(x, y + height);
        frame.lineTo(x, y);
        frame.closePath();    
    
        style_me(x,y,width,height,style);
        
        if (style && style.rotation) {frame.restore();}
    }
    
    function style_me(x,y,width,height,style) 
    {     
        if (!style) {
            style = create_style("", 1, "black")
        }

        if (style.fill_color) {
            if (style.fill_color.constructor.name == "Array") {
                if (style.gradient && style.gradient.constructor.name == "Array") {
                    var gradient;
                    if (style.gradient[0].toLowerCase() == "linear") {
                        if (style.gradient[1].toLowerCase() == "auto") {
                            gradient = frame.createLinearGradient(x, y, x + width, y);
                        } else {
                            gradient = frame.createLinearGradient(  style.gradient[1],
                                                                    style.gradient[2],
                                                                    style.gradient[3],
                                                                    style.gradient[4]);
                        }
                    } else if (style.gradient[0].toLowerCase() == "radial") {
                        if (style.gradient[1].toLowerCase() == "auto") {
                            gradient = frame.createRadialGradient(x + width / 2, y + height / 2, 0, x + width / 2, y + height / 2, width / 2);
                        } else {
                            gradient = frame.createRadialGradient(  style.gradient[1],
                                                                    style.gradient[2],
                                                                    style.gradient[3],
                                                                    style.gradient[4],
                                                                    style.gradient[5],
                                                                    style.gradient[6]);
                        }
                    } else {
                        frame.fillStyle = style.fill_color[0];
                    }
                    
                    if (gradient != undefined) {
                        gradient.addColorStop(0,style.fill_color[0]);
                        gradient.addColorStop(1,style.fill_color[1]);
                        frame.fillStyle = gradient;
                    }
                }
            } else {
                frame.fillStyle = style.fill_color;
            }
            frame.fill();
            
        }
                
        if (style.stroke_color) {
            frame.strokeStyle = style.stroke_color;
            frame.lineWidth = style.stroke_width;
            frame.stroke();    
        }
    }

}

