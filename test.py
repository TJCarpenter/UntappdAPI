def z(k,n):
    if k == n:
        return k   
    else: 
        if k < n:
            return z(k, n-k)
        else:
            return z(k-n, n)


B = z(1, 6)
print(B)