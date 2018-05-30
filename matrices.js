
function MatrixZero(r, c)
{
    var ret = { "r": r, "c": c };
    for (var i = 0; i < r; i++)
    {
        ret[i] = [];
        for (var j = 0; j < c; j++)
        {
            ret[i][j] = 0;
        }
    }
    return ret;
}

function Matrix44Identity()
{
    return MatrixIdentity(4);
}

function MatrixIdentity(rc)
{
    var ret = { "r": rc, "c": rc };
    for (var i = 0; i < rc; i++)
    {
        ret[i] = [];
        for (var j = 0; j < rc; j++)
        {
            ret[i][j] = i == j ? 1 : 0;
        }
    }
    return ret;
}

function MatrixMultiply(a, b)
{
    //Log.verbose("[" + a.r + " x " + a.c + "] x [" + b.r + " x " + b.c + "]");
    if (a.c != b.r)
        return null;
    var ret = MatrixZero(a.r, b.c);
    for (var i = 0; i < a.r; i++)
    {
        for (var j = 0; j < b.c; j++)
        {
            var s = 0;
            for (var k = 0; k < a.c; k++)
            {
                s += a[i][k] * b[k][j];
            }
            ret[i][j] = s;
        }
    }
    return ret;
}

function VectorTransform(t, v)
{
    return VectorProjection(VectorColumn(MatrixMultiply(t, MatrixColumn(VectorHomogeneous(v))), 0));
}

function MatrixColumn(v)
{
    var ret = MatrixZero(v.length, 1);
    for (var i = 0; i < v.length; i++)
    {
        ret[i][0] = v[i];
    }
    return ret;
}

function VectorHomogeneous(v)
{
    return v.concat([1]);
}

function VectorProjection(v)
{
    var ret = [];
    for (var i = 0; i < v.length - 1; i++)
    {
        ret[i] = v[i] / v[v.length - 1];
    }
    return ret;
}

function VectorColumn(m, j)
{
    var ret = [];
    for (var i = 0; i < m.r; i++)
    {
        ret[i] = m[i][j];
    }
    return ret;
}

function MatrixTranslate(c)
{
    var ret = MatrixIdentity(c.length + 1);
    for (var i = 0; i < c.length; i++)
    {
        ret[i][c.length] = c[i];
    }
    return ret;
}

function MatrixScale(s)
{
    var ret = MatrixIdentity(c.length + 1);
    for (var i = 0; i < c.length; i++)
    {
        ret[i][i] = s[i];
    }
    return ret;
}

function Matrix44Rotate(d, a)
{
    var ret = MatrixIdentity(d.length + 1);
    var n = VectorUnit(d);
    var p = 1 - Math.cos(a), q = Math.sin(a);
    ret[0][0] = (n[0] * n[0] - 1) * p + 1;
    ret[0][1] = n[0] * n[1] * p - n[2] * q;
    ret[0][2] = n[0] * n[2] * p + n[1] * q;
    ret[1][0] = n[0] * n[1] * p + n[2] * q;
    ret[1][1] = (n[1] * n[1] - 1) * p + 1;
    ret[1][2] = n[1] * n[2] * p - n[0] * q;
    ret[2][0] = n[0] * n[2] * p - n[1] * q;
    ret[2][1] = n[1] * n[2] * p + n[0] * q;
    ret[2][2] = (n[2] * n[2] - 1) * p + 1;
    return ret;
}

function VectorSquare(v)
{
    return VectorDot(v, v);
}

function VectorNorm(v)
{
    return Math.sqrt(VectorSquare(v));
}

function VectorUnit(v)
{
    return VectorScalar(v, 1 / VectorNorm(v));
}

function VectorScalar(v, k)
{
    var ret = [];
    for (var i = 0; i < v.length; i++)
    {
        ret[i] = v[i] * k;
    }
    return ret;
}

function VectorDot(a, b)
{
    var n = Math.min(a.length, b.length);
    var ret = 0;
    for (var i = 0; i < n; i++)
    {
        ret += a[i] * b[i];
    }
    return ret;
}

function MatrixInverse(m)
{
    if (m.r != m.c)
        return null;
    var am = MatrixConcatColumns(m, MatrixIdentity(m.r));
    //Log.debug(JSON.stringify(am));
    //Log.debug(MatrixToString(am));
    for (var i = 0; i < m.r; i++)
    {
        if (am[i][i] == 0)
        {
            for (var j = i + 1; j < m.r; j++)
            {
                if (am[j][i] != 0)
                {
                    var t = am[i];
                    am[i] = am[j];
                    am[j] = t;
                    break;
                }
            }
            if (am[i][i] == 0) {
                //alert([i, j]);
                //alert(JSON.stringify(m));
                return null;
            }
        }
        //Log.debug(MatrixToString(am));
        for (var j = i + 1; j < am.c; j++)
        {
            am[i][j] /= am[i][i];
        }
        am[i][i] = 1;
        //Log.debug(MatrixToString(am));
        for (var j = 0; j < m.r; j++)
        {
            if (i != j)
            {
                for (var k = i + 1; k < am.c; k++)
                {
                    am[j][k] -= am[j][i] * am[i][k];
                }
                am[j][i] = 0;
                //Log.debug(MatrixToString(am));
            }
        }
    }
    //Log.debug(JSON.stringify(MatrixMultiply(MatrixSliceColumns(am, m.r, m.r), m)));
    //Log.debug(JSON.stringify(MatrixMultiply(m, MatrixSliceColumns(am, m.r, m.r))));
    //Log.debug(MatrixToString(am));
    //Log.debug(MatrixToString(MatrixSliceColumns(am, m.r, m.r)));
    return MatrixSliceColumns(am, m.r, m.r);
}

function MatrixConcatColumns(a, b)
{
    if (a.r != b.r)
        return null;
    var ret = MatrixZero(a.r, a.c + b.c);
    for (var i = 0; i < a.r; i++)
    {
        for (var j = 0; j < a.c; j++)
        {
            ret[i][j] = a[i][j];
        }
        for (var j = 0; j < b.c; j++)
        {
            ret[i][a.c + j] = b[i][j];
        }
    }
    return ret;
}

function MatrixSliceColumns(m, o, c)
{
    var ret = MatrixZero(m.r, c);
    for (var i = 0; i < m.r; i++)
    {
        for (var j = 0; j < c; j++)
        {
            ret[i][j] = m[i][o + j];
        }
    }
    return ret;
}

function MatrixToArray(m)
{
    var ret = [];
    for (var i = 0; i < m.r; i++)
    {
        ret[i] = m[i];
    }
    return ret;
}

function MatrixToStringArray(m)
{
    var ret = [];
    for (var i = 0; i < m.r; i++) {
        ret[i] = VectorToStringArray(m[i]);
    }
    return ret;
}

function VectorToStringArray(v)
{
    var ret = [];
    for (var i = 0; i < v.length; i++)
    {
        ret[i] = v[i].toPrecision(4);
    }
    return ret;
}

function MatrixToString(m)
{
    return MatrixToStringArray(m).join("\n");
}
