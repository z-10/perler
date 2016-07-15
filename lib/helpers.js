(function(window){
  window.RGB_TO_LAB = function(r, g, b){
    var fr = r / 255.0,
        fg = g / 255.0,
        fb = b / 255.0,
        x,y,z, L,a,b;

        if(fr > 0.04045){
          fr = Math.pow(((fr + 0.055) / 1.055), 2.2);
        } else {
          fr = fr / 12.92;
        }
        if(fg > 0.04045){
          fg = Math.pow(((fg + 0.055) / 1.055), 2.2);
        } else {
          fg = fg / 12.92;
        }
        if(fb > 0.04045){
          fb = Math.pow(((fb + 0.055) / 1.055), 2.2);
        } else {
          fb = fb / 12.92;
        }

        fr = fr * 100.0;
        fg = fg * 100.0;
        fb = fb * 100.0;

        x = fr * 0.4124 + fg * 0.3576 + fb * 0.1805;
        y = fr * 0.2126 + fg * 0.7152 + fb * 0.0722;
        z = fr * 0.0193 + fg * 0.1192 + fb * 0.9505;

        x = x / 95.047;
        y = y / 100.0;
        z = z / 108.883;


        if ( x > 0.008856 ){
          x = Math.pow(x,( 1.0/3.0 ));
        } else {
          x = ( 7.787 * x ) + ( 16.0 / 116.0 );
        };
        if ( y > 0.008856 ){
          y = Math.pow(y,( 1.0/3.0 ));
        } else {
          y = ( 7.787 * y ) + ( 16.0 / 116.0 );
        };
        if ( z > 0.008856 ){
          z = Math.pow(z,( 1.0/3.0 ));
        } else {
          z = ( 7.787 * z ) + ( 16.0 / 116.0 );
        };

        L = (116 * y) - 16;
        a = 500 * (x - y);
        b = 200 * (y - z);

        return [L, a, b];
  };

  window.TO_DEGREES = function (angle) {
      return angle * (180 / Math.PI);
  };

  window.TO_RAD = function (num) {
      return num * Math.PI / 180;
  };


  window.DELTA_E_00 = function(L1, a1, b1, L2, a2, b2){
    var k_L =1.0,
        k_C = 1.0,
        k_H = 1.0,
        C1 = Math.sqrt(Math.pow(a1,2) + Math.pow(b1,2)),
        C2 = Math.sqrt(Math.pow(a2,2) + Math.pow(b2,2)),
        C_avr = (C1 + C2) / 2.0,
        G = 0.5 * (1.0 - Math.sqrt(Math.pow(C_avr,7)/(Math.pow(C_avr,7) + Math.pow(25,7)))),
        a1_1 = (1 + G) * a1,
        a2_1 = (1 + G) * a2,
        C1_1 = Math.sqrt(Math.pow(a1_1, 2) + Math.pow(b1, 2)),
        C2_1 = Math.sqrt(Math.pow(a2_1, 2) + Math.pow(b2, 2)),
        h1, h2,
        deltah, deltaH,
        deltaL, deltaC,
        L_av, C_1_av,
        hDiff,
        L_av_m50,
        SL, SC, T, SH, dTheta, RC, RT,
        dkL, dkC, dkH,
        result;

        // add h' for both colors
        if (a1_1 === 0 && b1 === 0) {
          h1 = 0;
        } else {
          if (b1 >= 0) {
            h1 = window.TO_DEGREES(Math.atan2(b1, a1_1));
          } else {
            h1 = window.TO_DEGREES(Math.atan2(b1, a1_1)) + 360;
          }
        }
        if (a2_1 === 0 && b2 === 0) {
          h2 = 0;
        } else {
          if (b2 >= 0) {
            h2 = window.TO_DEGREES(Math.atan2(b2, a2_1));
          } else {
            h2 = window.TO_DEGREES(Math.atan2(b2, a2_1)) + 360;
          }
        }

        if ((C1_1 * C2_1) === 0) {
          deltah = 0;
        } else {
          if (Math.abs(h2 - h1) <= 180) {
            deltah = h2 - h1;
          } else {
            if (h2 - h1 > 180) {
              deltah = h2 - h1 - 360;
            } else {
              deltah = h2 - h1 + 360;
            }
          }
        }
        deltaH = 2 * Math.sqrt(C1_1 * C2_1) * Math.sin(window.TO_RAD(deltah / 2));
        deltaL = L1 - L2;
        deltaC = C2_1 - C1_1;

        L_av = (L1 + L2) / 2;
        C_1_av = (C1_1 + C2_1) / 2;

        if ((C1_1 * C2_1) === 0) {
          hDiff = h1 + h2;
        } else {
          if (Math.abs(h2 - h1) > 180) {
            if ((h2 + h1) < 360) {
              hDiff = h1 + h2 + 360;
            } else {
              hDiff = h1 + h2 - 360;
            }
          } else {
            hDiff = h1 + h2;
          }
          hDiff = hDiff / 2;
        }

        L_av_m50 =  Math.pow((L_av - 50), 2);
        SL = 1 + ((0.015 * L_av_m50) / Math.sqrt(20 + L_av_m50));
        SC = 1 + 0.045 * C_1_av;
        T = 1 - 0.17 * Math.cos(window.TO_RAD(hDiff - 30)) + 0.24 * Math.cos(window.TO_RAD(2 * hDiff)) + 0.32 * Math.cos(window.TO_RAD(3 * hDiff + 6)) - 0.20 * Math.cos(window.TO_RAD(4 * hDiff - 63));
        SH = 1 + 0.015 * C_1_av * T;
        dTheta = 30 * Math.exp(-1 * Math.pow((hDiff - 275) / 25, 2));
        RC = 2 * Math.sqrt(Math.pow(C_1_av, 7) / (Math.pow(C_1_av, 7) + Math.pow(25, 7)));
        RT = 0 - Math.sin(window.TO_RAD(2 * dTheta)) * RC;

        dkL = deltaL / (k_L * SL);
        dkC = deltaC / (k_C * SC);
        dkH = deltaH / (k_H * SH);

        result = Math.sqrt(Math.pow(dkL, 2) + Math.pow(dkC, 2) + Math.pow(dkH, 2) + RT * dkC * dkH);

        return result;
  }
})(window);
