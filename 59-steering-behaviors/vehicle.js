
class Vehicle {
    constructor(x, y) {
        this.pos = createVector(random(width), random(height));
        this.vel = p5.Vector.random2D();
        this.vel.setMag(random(2, 4));

        this.acc = createVector();
        this.target = createVector(x, y);
        this.r = 8;
        this.maxSpeed = 7;
        this.maxForce = 0.4;

        this.h = 0;
        this.mapHue(x);

    }

    mapHue(x) {
        this.h = map(x, 0, width, 0, 255);
    }

    update() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc = createVector();
    }

    display() {
        colorMode(HSB);
        
        stroke(this.h, 200, 100);
        strokeWeight(this.r);
        point(this.pos.x, this.pos.y);
    }

    behaviors() {
        let arrive = this.arrive(this.target);
        arrive.mult(1);
        this.applyForce(arrive);

        let mouse = createVector(mouseX, mouseY);
        let flee = this.flee(mouse);
        flee.mult(5);
        this.applyForce(flee);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    flee(target){
        // Points from current position to target.
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        if (d > fleeRadius) {
            return createVector(0, 0);
        }
        desired.setMag(map(d, fleeRadius, 0, 0, this.maxSpeed));
        desired.mult(-1);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }

    arrive(target){
        // Points from current position to target.
        let desired = p5.Vector.sub(target, this.pos);
        let d = desired.mag();
        let speed = this.maxSpeed
        if (d < 100) {
            speed = map(d, 0, 100, 0, this.maxSpeed);
        }
        desired.setMag(speed);
        let steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxForce);
        return steer;
    }
}