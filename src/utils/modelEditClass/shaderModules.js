import * as THREE from "three";
import { useMeshEditStore } from "@/store/meshEditStore";
import { SHADER_METHOD_ENUM } from "@/config/constant";
import { getMousePosition } from "@/utils/utilityFunction";

const store = useMeshEditStore();
// 着色器方法映射
const shaderMethodMap = {
  [SHADER_METHOD_ENUM.CreateWarningShader]: createWarningShader,
  [SHADER_METHOD_ENUM.CreateCompassShader]: createCompassShader,
  [SHADER_METHOD_ENUM.CreateRadarShader]: createRadarShader,
  [SHADER_METHOD_ENUM.CreateWallShader]: createWallShader,
  [SHADER_METHOD_ENUM.CreateApertureShader]: createApertureShader,
  [SHADER_METHOD_ENUM.CreateFlickerWarning]: createFlickerWarning,
  [SHADER_METHOD_ENUM.CreateWarningApertureShader]: createWarningApertureShader
};

export default class CreateShaderModules {
  constructor() {
    this.click = new THREE.Clock();
    // 缓存需要更新的着色器对象，避免每帧遍历整个场景
    this.shaderCache = new Map();
    // 拖拽着色器
    this.dragShader = null;
  }
  setDragShader(shader) {
    this.dragShader = shader;
  }
  /**
   * 初始化着色器缓存
   */
  initShaderCache() {
    this.shaderCache.clear();
    store.sceneApi?.scene?.traverse(object => {
      if (object instanceof THREE.Mesh && object.userData?.type === DRAG_MODEL_ENUM.Shader) {
        this.registerShader(object, object.userData.shaderMethod);
      }
    });
  }
  /**
   * 创建着色器
   * @param options 着色器数据
   * @returns 着色器网格
   */
  createShader(options) {
    const { clientX, clientY } = options;

    const shaderMethod = this.dragShader?.shaderMethod;

    if (!shaderMethod || !shaderMethodMap[shaderMethod]) {
      console.error("不支持的着色器方法:", shaderMethod);
      return null;
    }

    const shader = shaderMethodMap[shaderMethod]();

    if (!shader) {
      console.error("着色器创建失败");
      return null;
    }

    // 设置位置
    if (clientX && clientY) {
      const mousePosition = getMousePosition(clientX, clientY);
      shader.position.copy(mousePosition);
    }

    // 设置用户数据
    shader.userData = {
      isTransformControls: true,
      type: "Shader",
      shaderMethod,
      // 生成一个唯一 id，解决模型每次加载后uuid 变化问题
      onlyUuid: THREE.MathUtils.generateUUID()
    };
    shader.name = this.dragShader.name;
    // 注册着色器到缓存中
    this.registerShader(shader, shaderMethod);
    // 添加到场景
    store.modelApi?.scene?.add(shader);
  }

  /**
   * 注册着色器到缓存中
   * @param mesh 着色器网格对象
   * @param shaderMethod 着色器方法类型
   */
  registerShader(mesh, shaderMethod) {
    const uuid = mesh.userData.onlyUuid;
    let updateType;
    // 根据着色器类型确定更新类型
    if (
      [
        SHADER_METHOD_ENUM.CreateWarningShader,
        SHADER_METHOD_ENUM.CreateWallShader,
        SHADER_METHOD_ENUM.CreateApertureShader,
        SHADER_METHOD_ENUM.CreateFlickerWarning
      ].includes(shaderMethod)
    ) {
      updateType = "uTime";
    } else if ([SHADER_METHOD_ENUM.CreateRadarShader, SHADER_METHOD_ENUM.CreateCompassShader].includes(shaderMethod)) {
      updateType = "iTime";
    } else if (shaderMethod === SHADER_METHOD_ENUM.CreateWarningApertureShader) {
      updateType = "scale";
    } else {
      // 不需要更新的着色器类型
      return;
    }

    this.shaderCache.set(uuid, {
      mesh,
      shaderMethod,
      updateType
    });
  }

  /**
   * 清空着色器缓存
   */
  clearShaderCache() {
    this.shaderCache.clear();
  }

  /**
   * 从缓存中注销着色器
   * @param mesh 着色器网格对象
   */
  unregisterShader(mesh) {
    const uuid = mesh.userData?.onlyUuid;
    if (uuid) {
      this.shaderCache.delete(uuid);
    }
  }
  deleteShader(uuid) {
    const shader = this.shaderCache.get(uuid);

    if (shader) {
      shader.mesh.parent.remove(shader.mesh);
      this.shaderCache.delete(uuid);
    }
  }
  /**
   * 更新所有着色器的时间uniform，并同步更新WallShader的相关uniform参数
   * 优化版本：使用缓存避免每帧遍历整个场景
   */
  updateAllShaderTime() {
    // 使用缓存直接更新，避免遍历整个场景
    for (const [uuid, shaderData] of this.shaderCache) {
      const { mesh, updateType } = shaderData;

      // 检查对象是否仍然存在于场景中
      if (!mesh.parent) {
        this.shaderCache.delete(uuid);
        continue;
      }
      // 根据更新类型执行不同的更新逻辑
      switch (updateType) {
        case "uTime":
          this.updateUTimeShader(mesh);
          break;
        case "iTime":
          this.updateITimeShader(mesh);
          break;
        case "scale":
          this.updateScaleShader(mesh);
          break;
      }
    }
  }

  /**
   * 更新uTime类型的着色器
   * @param mesh 着色器网格对象
   */
  updateUTimeShader(mesh) {
    if (mesh.material instanceof THREE.ShaderMaterial && mesh.material.uniforms && mesh.material.uniforms.uTime) {
      mesh.material.uniforms.uTime.value = this.click.getElapsedTime();
    }
  }

  /**
   * 更新iTime类型的着色器
   * @param mesh 着色器网格对象
   */
  updateITimeShader(mesh) {
    if (mesh.material instanceof THREE.ShaderMaterial && mesh.material.uniforms && mesh.material.uniforms.iTime) {
      mesh.material.uniforms.iTime.value += 0.01;
    }
  }

  /**
   * 更新缩放类型的着色器
   * @param mesh 着色器网格对象
   */
  updateScaleShader(mesh) {
    // 初始化缩放值
    if (!mesh.userData.scaleY) {
      mesh.userData.scaleY = 0.2;
      mesh.userData.scaleDirection = 1; // 1为增长，-1为减少
    }

    // 更新缩放值
    mesh.userData.scaleY += mesh.userData.scaleDirection * 0.03;

    // 检查边界并切换方向
    if (mesh.userData.scaleY >= 1.4) {
      mesh.userData.scaleY = 1.4;
      mesh.userData.scaleDirection = -1;
    } else if (mesh.userData.scaleY <= 0.2) {
      mesh.userData.scaleY = 0.2;
      mesh.userData.scaleDirection = 1;
    }

    // 应用Y轴缩放
    mesh.scale.setY(mesh.userData.scaleY);
  }
}

/**
 * 创建警告着色器
 * @returns 着色器网格
 */
function createWarningShader() {
  const geometry = new THREE.PlaneGeometry(2, 2, 2, 2);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(1.0, 0.0, 0.0) },
      uIntensity: { value: 1.0 },
      uSpeed: { value: 1.0 },
      uRadius: { value: 0.5 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uSpeed;
      uniform float uRadius;

      void main() {
        vec3 color = uColor;
        vec2 center = vec2(0.5, 0.5);
        float dis = distance(vUv, center);
        float p = 6.0;
        float r = fract(dis * p - uTime * uSpeed) / 3.0 + step(0.99, fract(dis * p - uTime * uSpeed));
        
        if (dis > uRadius) {
          r = 0.0;
        }
        
        gl_FragColor = vec4(color, r * uIntensity);
      }
    `
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

/**
 * 创建罗盘着色器
 * @returns 着色器网格
 */
function createCompassShader() {
  const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      iTime: {
        value: 0
      },

      iResolution: {
        value: new THREE.Vector2(4, 4)
      }
    },
    vertexShader: `
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() { 
              vUv = uv; 
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * mvPosition;
            }
    
    `,
    fragmentShader: `
  
            uniform float ratio;
            float PI = 3.1415926;
            uniform float iTime;
            uniform vec2 iResolution; 
            varying vec2 vUv;
            
            vec2 rotate(vec2 p, float rad) {
                mat2 m = mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
                return m * p;
            }
            
            vec2 translate(vec2 p, vec2 diff) {
                return p - diff;
            }
            
            vec2 scale(vec2 p, float r) {
                return p*r;
            }
            
            float circle(float pre, vec2 p, float r1, float r2, float power) {
                float leng = length(p);
                float d = min(abs(leng-r1), abs(leng-r2));
                if (r1<leng && leng<r2) pre /= exp(d)/r2;
                float res = power / d;
                return clamp(pre + res, 0.0, 1.0);
            }
            
            float rectangle(float pre, vec2 p, vec2 half1, vec2 half2, float power) {
                p = abs(p);
                if ((half1.x<p.x || half1.y<p.y) && (p.x<half2.x && p.y<half2.y)) {
                    pre = max(0.01, pre);
                }
                float dx1 = (p.y < half1.y) ? abs(half1.x-p.x) : length(p-half1);
                float dx2 = (p.y < half2.y) ? abs(half2.x-p.x) : length(p-half2);
                float dy1 = (p.x < half1.x) ? abs(half1.y-p.y) : length(p-half1);
                float dy2 = (p.x < half2.x) ? abs(half2.y-p.y) : length(p-half2);
                float d = min(min(dx1, dx2), min(dy1, dy2));
                float res = power / d;
                return clamp(pre + res, 0.0, 1.0);
            }
            
            float radiation(float pre, vec2 p, float r1, float r2, int num, float power) {
                float angle = 2.0*PI/float(num);
                float d = 1e10;
                for(int i=0; i<360; i++) {
                    if (i>=num) break;
                    float _d = (r1<p.y && p.y<r2) ? 
                        abs(p.x) : 
                        min(length(p-vec2(0.0, r1)), length(p-vec2(0.0, r2)));
                    d = min(d, _d);
                    p = rotate(p, angle);
                }
                float res = power / d;
                return clamp(pre + res, 0.0, 1.0);
            }
            
            vec3 calc(vec2 p) {
                float dst = 0.0;
                p = scale(p, sin(PI*iTime/1.0)*0.02+1.1);
                {
                    vec2 q = p;
                    q = rotate(q, iTime * PI / 6.0);
                    dst = circle(dst, q, 0.85, 0.9, 0.006);
                    dst = radiation(dst, q, 0.87, 0.88, 36, 0.0008);
                }
                {
                    vec2 q = p;
                    q = rotate(q, iTime * PI / 6.0);
                    const int n = 6;
                    float angle = PI / float(n);
                    q = rotate(q, floor(atan(q.x, q.y)/angle + 0.5) * angle);
                    for(int i=0; i<n; i++) {
                        dst = rectangle(dst, q, vec2(0.85/sqrt(2.0)), vec2(0.85/sqrt(2.0)), 0.0015);
                        q = rotate(q, angle);
                    }
                }
                {
                    vec2 q = p;
                    q = rotate(q, iTime * PI / 6.0);
                    const int n = 12;
                    q = rotate(q, 2.0*PI/float(n)/2.0);
                    float angle = 2.0*PI / float(n);
                    for(int i=0; i<n; i++) {
                        dst = circle(dst, q-vec2(0.0, 0.875), 0.001, 0.05, 0.004);
                        dst = circle(dst, q-vec2(0.0, 0.875), 0.001, 0.001, 0.008);
                        q = rotate(q, angle);
                    }
                }
                {
                    vec2 q = p;
                    dst = circle(dst, q, 0.5, 0.55, 0.002);
                }
                {
                    vec2 q = p;
                    q = rotate(q, -iTime * PI / 6.0);
                    const int n = 3;
                    float angle = PI / float(n);
                    q = rotate(q, floor(atan(q.x, q.y)/angle + 0.5) * angle);
                    for(int i=0; i<n; i++) {
                        dst = rectangle(dst, q, vec2(0.36, 0.36), vec2(0.36, 0.36), 0.0015);
                        q = rotate(q, angle);
                    }
                }
                {
                    vec2 q = p;
                    q = rotate(q, -iTime * PI / 6.0);
                    const int n = 12;
                    q = rotate(q, 2.0*PI/float(n)/2.0);
                    float angle = 2.0*PI / float(n);
                    for(int i=0; i<n; i++) {
                        dst = circle(dst, q-vec2(0.0, 0.53), 0.001, 0.035, 0.004);
                        dst = circle(dst, q-vec2(0.0, 0.53), 0.001, 0.001, 0.001);
                        q = rotate(q, angle);
                    }
                }
                {
                    vec2 q = p;
                    q = rotate(q, iTime * PI / 6.0);
                    dst = radiation(dst, q, 0.25, 0.3, 12, 0.005);
                }
                {
                    vec2 q = p;
                    q = scale(q, sin(PI*iTime/1.0)*0.04+1.1);
                    q = rotate(q, -iTime * PI / 6.0);
                    for(float i=0.0; i<6.0; i++) {
                        float r = 0.13-i*0.01;
                        q = translate(q, vec2(0.1, 0.0));
                        dst = circle(dst, q, r, r, 0.002);
                        q = translate(q, -vec2(0.1, 0.0));
                        q = rotate(q, -iTime * PI / 12.0);
                    }
                    dst = circle(dst, q, 0.04, 0.04, 0.004);
                }
                return pow(dst, 2.5) * vec3(1.0, 0.95, 0.8);
            }
            
            void main() { 
                    vec2 uv = (vUv - 0.5) * 2.0;
            vec3 color = calc(uv);
            float intensity = length(color);
            if (intensity < 0.01) discard;
            // 修改alpha计算，让底色完全透明
            float alpha = step(0.01, intensity) * intensity;
            gl_FragColor = vec4(color, alpha);
              }
          
  `
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

/**
 * 创建扫描雷达着色器
 * @returns 着色器网格
 */
function createRadarShader() {
  const geometry = new THREE.PlaneGeometry(3, 3);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      iTime: {
        value: 0
      },
      iResolution: {
        value: new THREE.Vector2(700, 700)
      },
      iChannel0: {
        value: 2000
      }
    },
    vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() { 
            vUv = uv; 
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
    #define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
    #define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )
    #define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )
    #define M_PI 3.1415926535897932384626433832795
    
    #define blue1 vec3(0.74,0.95,1.00)
    #define blue2 vec3(0.87,0.98,1.00)
    #define blue3 vec3(0.35,0.76,0.83)
    #define blue4 vec3(0.953,0.969,0.89)
    
    uniform float ratio;
    
    float PI = 3.1415926;
    uniform float iTime;
    uniform vec2 iResolution; 
    varying vec2 vUv;
    
    // 改进的扫描线函数，覆盖整个圆半径
    float movingLine(vec2 uv, vec2 center, float radius)
    {
        //angle of the line - 扫描角度
        float theta0 = 90.0 * iTime;
        vec2 d = uv - center;
        float r = sqrt( dot( d, d ) );
        
        if(r < radius)
        {
            //compute the distance to the line theta=theta0
            vec2 p = radius*vec2(cos(theta0*M_PI/180.0),
                                -sin(theta0*M_PI/180.0));
            float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
            d = normalize(d);
            
            //compute gradient based on angle difference to theta0
            float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);
            float gradient = clamp(1.0-theta/90.0,0.0,1.0);
            
            // 增强扫描效果，让扫描线更明显
            float scanIntensity = SMOOTH(l,2.0) + 0.8*gradient;
            
            // 添加扫描尾迹效果
            float trail = 1.0 - smoothstep(0.0, 60.0, theta);
            scanIntensity += trail * 0.3;
            
            return scanIntensity;
        }
        else return 0.0;
    }
    
    float circle(vec2 uv, vec2 center, float radius, float width)
    {
        float r = length(uv - center);
        return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
    }
    
    float circle2(vec2 uv, vec2 center, float radius, float width, float opening)
    {
        vec2 d = uv - center;
        float r = sqrt( dot( d, d ) );
        d = normalize(d);
        if( abs(d.y) > opening )
            return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
        else
            return 0.0;
    }
    
    float circle3(vec2 uv, vec2 center, float radius, float width)
    {
        vec2 d = uv - center;
        float r = sqrt( dot( d, d ) );
        d = normalize(d);
        float theta = 180.0*(atan(d.y,d.x)/M_PI);
        return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *
            mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *
            (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));
    }
    
    float triangles(vec2 uv, vec2 center, float radius)
    {
        vec2 d = uv - center;
        return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))
            + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))
            + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))
            + RS( 0.0, 8.0, d.y+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.x)));
    }
    
    float _cross(vec2 uv, vec2 center, float radius)
    {
        vec2 d = uv - center;
        int x = int(d.x);
        int y = int(d.y);
        float r = sqrt( dot( d, d ) );
        if( (r<radius) && ( (x==y) || (x==-y) ) )
            return 1.0;
        else return 0.0;
    }
    
    float dots(vec2 uv, vec2 center, float radius)
    {
        vec2 d = uv - center;
        float r = sqrt( dot( d, d ) );
        if( r <= 2.5 )
            return 1.0;
        if( ( r<= radius) && ( (abs(d.y+0.5)<=1.0) && ( mod(d.x+1.0, 50.0) < 2.0 ) ) )
            return 1.0;
        else if ( (abs(d.y+0.5)<=1.0) && ( r >= 50.0 ) && ( r < 115.0 ) )
            return 0.5;
        else
            return 0.0;
    }
    
    void main() { 
        vec2 _uv = vec2(vUv.x * iResolution.x, vUv.y * iResolution.y);
        vec3 finalColor;
        vec2 uv = _uv;
        //center of the image
        vec2 c = vec2(iResolution.x / 2.0, iResolution.y / 2.0);
        
        // 基础雷达圆环
        finalColor = vec3( 0.3*_cross(uv, c, 240.0) );
        finalColor += ( circle(uv, c, 100.0, 1.0)
                    + circle(uv, c, 165.0, 1.0) ) * blue1;
        finalColor += circle(uv, c, 240.0, 2.0);
        // finalColor += circle3(uv, c, 313.0, 4.0) * blue1; // 移除最外围圆圈
        finalColor += triangles(uv, c, 315.0 + 30.0*sin(iTime)) * blue2;
        
        // 中心点
        finalColor += circle(uv, c, 10.0, 1.0) * blue3;
        
        // 扫描线 - 覆盖整个圆半径
        finalColor += movingLine(uv, c, 240.0) * blue3;
        
        // 扫描区域指示器
        finalColor += 0.7 * circle2(uv, c, 262.0, 1.0, 0.5+0.2*cos(iTime)) * blue3;
        
        // 移除了所有移动红点相关的代码（bip1, bip2, MOV等）
    
        // 计算颜色强度，用于透明度控制
        float intensity = length(finalColor);
        
        // 如果颜色强度很低（接近黑色），则设为完全透明
        float alpha = step(0.01, intensity) * intensity;
        
        gl_FragColor = vec4( finalColor, alpha );
        
    }
    `
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

/**
 * 创建光圈收缩着色器
 * @returns 着色器网格
 */
function createApertureShader() {
  const geometry = new THREE.PlaneGeometry(3, 3, 500, 500);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uOuterColor: { value: new THREE.Color("#2b90e0") }, // 外圆圆环颜色 - 鲜艳的蓝色
      uOuterGlowColor: { value: new THREE.Color("#00bfff") }, // 外环发光颜色 - 亮蓝色发光
      uInnerColor: { value: new THREE.Color(0x87ceeb) }, // 内圆颜色 - 柔和的浅蓝色
      uInnerGlowColor: { value: new THREE.Color(0x87ceeb) }, // 内圆发光颜色 - 柔和的发光
      uIntensity: { value: 0.8 }, // 透明度
      uSpeed: { value: 2.5 }, // 加快收缩速度
      uOuterRadius: { value: 0.9 }, // 外圆半径
      uInnerRadius: { value: 0.4 }, // 增大内圆半径
      uRingDistance: { value: 0.18 }, // 内外圆固定距离
      uHexDensity: { value: 2.0 }, // 六边形密度
      uGlowIntensity: { value: 2 } // 辉光强度
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      uniform vec3 uOuterColor;
      uniform vec3 uOuterGlowColor;
      uniform vec3 uInnerColor;
      uniform vec3 uInnerGlowColor;
      uniform float uIntensity;
      uniform float uSpeed;
      uniform float uOuterRadius;
      uniform float uInnerRadius;
      uniform float uRingDistance;
      uniform float uHexDensity;
      uniform float uGlowIntensity;

      // 六边形距离场函数
      float hexDist(vec2 p) {
        p = abs(p);
        return max(p.x * 0.866025 + p.y * 0.5, p.y);
      }

      // 六边形网格函数
      vec2 hexGrid(vec2 p) {
        vec2 h = vec2(0.866025, 0.5);
        vec2 g1 = vec2(h.x, -h.y);
        vec2 g2 = vec2(0.0, 1.0);
        
        vec2 id1 = floor(vec2(dot(p, g1), dot(p, g2)));
        vec2 id2 = floor(vec2(dot(p, g1), dot(p, g2)) + 0.5);
        
        vec2 p1 = p - id1.x * g1 - id1.y * g2;
        vec2 p2 = p - id2.x * g1 - id2.y * g2;
        
        float d1 = hexDist(p1);
        float d2 = hexDist(p2);
        
        if (d1 < d2) {
          return vec2(d1, 0.0);
        } else {
          return vec2(d2, 1.0);
        }
      }

      // 噪声函数
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      // 平滑噪声
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        vec2 u = f * f * (3.0 - 2.0 * f);
        
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = (vUv - 0.5) * 2.0;
        vec2 center = vec2(0.0, 0.0);
        float dist = length(uv);
        
        // 时间动画 - 光圈收缩效果，统一频率
        float time = uTime * uSpeed;
        float shrinkFactor = 0.3 + 0.7 * (0.5 + 0.5 * sin(time)); // 更快的收缩速度
        
        // 计算当前半径，保持固定距离
        float currentInnerRadius = uInnerRadius * shrinkFactor;
        float currentOuterRadius = currentInnerRadius + uRingDistance;
        
        // 确保不重叠，外圆最小半径
        currentOuterRadius = max(currentOuterRadius, currentInnerRadius + 0.05);
        
        // 外环发光效果 - 更细的环
        float outerRing = smoothstep(currentOuterRadius - 0.08, currentOuterRadius, dist) * 
                         (1.0 - smoothstep(currentOuterRadius, currentOuterRadius + 0.15, dist));
        
        // 内环 - 实心圆
        float innerRing = 1.0 - smoothstep(currentInnerRadius - 0.03, currentInnerRadius, dist);
        
        // 六边形图案 - 只在外环区域
        vec2 hexUV = uv * uHexDensity;
        vec2 hexData = hexGrid(hexUV);
        float hexPattern = 1.0 - smoothstep(0.2, 0.3, hexData.x);
        
        // 添加噪声变化
        float noiseValue = smoothNoise(hexUV * 1.5 + time * 0.3);
        hexPattern *= (0.6 + 0.4 * noiseValue);
        
        // 只在外环区域内显示六边形
        float ringMask = smoothstep(currentOuterRadius - 0.1, currentOuterRadius, dist) * 
                        (1.0 - smoothstep(currentOuterRadius, currentOuterRadius + 0.1, dist));
        hexPattern *= ringMask;
        
        // 发光效果 - 增强外环发光
        float outerGlow = exp(-abs(dist - currentOuterRadius) * uGlowIntensity * 0.8) * outerRing;
        float outerGlow2 = exp(-abs(dist - currentOuterRadius) * uGlowIntensity * 0.4) * outerRing * 0.6;
        float innerGlow = exp(-abs(dist - currentInnerRadius) * uGlowIntensity * 1.5) * innerRing;
        
        // 组合颜色 - 内外圆使用不同颜色
        vec3 finalColor = vec3(0.0);
        
        // 外环颜色 - 圆环使用uOuterColor，发光使用uOuterGlowColor
        if (outerRing > 0.0) {
          finalColor += uOuterColor * outerRing;
          finalColor += uOuterGlowColor * (outerGlow + outerGlow2) * 2.5; // 增强亮蓝色发光
        }
        
        // 内圆颜色 - 圆环使用uInnerColor，发光使用uInnerGlowColor
        if (innerRing > 0.0) {
          finalColor += uInnerColor * innerRing;
          finalColor += uInnerGlowColor * innerGlow * 0.3; // 减弱内圆发光
        }
        
        // 六边形图案颜色 - 使用外环颜色
        if (hexPattern > 0.0) {
          finalColor += uOuterColor * hexPattern * 0.6;
        }
        
        // 添加中心区域的柔和发光 - 使用内圆发光颜色
        if (dist < currentInnerRadius) {
          float centerGradient = 1.0 - smoothstep(0.0, currentInnerRadius * 0.7, dist);
          finalColor += uInnerGlowColor * centerGradient * 0.2; // 减弱中心发光
        }
        
        // 透明度计算
        float alpha = (outerRing + innerRing + hexPattern + outerGlow + outerGlow2 + innerGlow) * uIntensity;
        alpha = clamp(alpha, 0.0, 1.0);
        
        // 如果颜色强度很低，设为完全透明
        if (alpha < 0.01) {
          alpha = 0.0;
        }
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  return mesh;
}

/**
 * 创建流动墙体着色器
 * @returns 着色器网格
 */
function createWallShader() {
  // 暂时返回一个空的平面几何体
  const geometry = new THREE.PlaneGeometry(3, 1);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: {
        value: 0
      }
    },
    vertexShader: `
                varying vec2 vUv; 
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }
                `,
    fragmentShader: `
                uniform float uTime;
                varying vec2 vUv;
                #define PI 3.14159265

                void main(){

                vec4 baseColor = vec4(0.0,1.,0.5,1.);
    
                vec4 finalColor;
                    
                float amplitude = 1.;
                float frequency = 10.;
                
                float x = vUv.x;

                float y = sin(x * frequency) ;
                float t = 0.01*(-uTime*130.0);
                y += sin(x*frequency*2.1 + t)*4.5;
                y += sin(x*frequency*1.72 + t*1.121)*4.0;
                y += sin(x*frequency*2.221 + t*0.437)*5.0;
                y += sin(x*frequency*3.1122+ t*4.269)*2.5;
                y *= amplitude*0.06;
                y /= 3.;
                y += 0.55;

                vec4 color = gl_FragColor.rgba;

                float r = step(0.5, fract(vUv.y - uTime));

                baseColor.a = step(vUv.y,y) * (y-vUv.y)/y;
                
                gl_FragColor = baseColor;

                }
                `
  });
  return new THREE.Mesh(geometry, material);
}

/**
 * 创建闪烁警告着色器
 * @returns 着色器网格
 */
function createFlickerWarning() {
  const size = 1.2;
  const geometry = new THREE.PlaneGeometry(size, size, 1, 1);
  const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ff8c00") }, // 警告橙色
      uSpeed: { value: 12.0 },
      uIntensity: { value: 1.0 },
      uPulse: { value: 0.5 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform vec3 uColor;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uPulse;

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
     }
    float noise2(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      // four corners
      float a = hash21(i + vec2(0.0,0.0));
      float b = hash21(i + vec2(1.0,0.0));
      float c = hash21(i + vec2(0.0,1.0));
      float d = hash21(i + vec2(1.0,1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)*u.y*(1.0 - u.x) + (d - b)*u.x*u.y;
   }

      void main(){
        vec2 c = vec2(0.5);
        float d = distance(vUv, c);
        float flick = smoothstep(0.25, 0.0, fract(sin(uTime * uSpeed) * 0.5 + 0.5));
        float noise = noise2(vUv * 30.0 + uTime) * 0.2;
        float core = smoothstep(0.45, 0.0, d);
        float halo = smoothstep(0.9, 0.5, d) * (0.8 + flick * uPulse);
        float alpha = (core + halo * 0.8) * (uIntensity) + noise;
        vec3 col = uColor * (0.7 + 0.6 * flick);
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
        if (gl_FragColor.a < 0.02) discard;
      }
    `
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

/**
 * 创建圆圈围栏效果着色器
 * 实现深蓝色圆圈围栏，支持动态上下缩放
 * @returns 着色器网格
 */
function createWarningApertureShader() {
  const curve = new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3().setY(1.5));
  const geometry = new THREE.TubeGeometry(curve, 200, 0.7, 200, false);

  geometry.computeBoundingBox();
  const { max, min } = geometry.boundingBox || new THREE.Vector3();

  // 创建材质
  const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      uMax: { value: max },
      uMin: { value: min },
      uColor: { value: new THREE.Color(1.0, 0.0, 0.0) }
    },
    vertexShader: `
        varying vec4 vPosition;
        void main() {
          vPosition = modelMatrix * vec4(position,1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
    fragmentShader: `
        uniform vec3 uColor; // 半径        
        uniform vec3 uMax; 
        uniform vec3 uMin;
        uniform mat4 modelMatrix; // 世界矩阵
        varying vec4 vPosition; // 接收顶点着色传递进来的位置数据
        void main() {
          vec4 uMax_world = modelMatrix * vec4(uMax,1.0);
          vec4 uMin_world = modelMatrix * vec4(uMin,1.0);
          // 计算从底部到顶部的渐变透明度，整体透明度更低
          float heightFactor = (vPosition.y - uMin_world.y) / (uMax_world.y - uMin_world.y);
          float opacity = (1.0 - heightFactor) * 0.6; // 最大透明度0.6，从底部到顶部逐渐降低
          gl_FragColor = vec4( uColor, opacity);
        }
      `
  });

  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}
