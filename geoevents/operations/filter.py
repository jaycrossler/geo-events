import operator


def operations_to_functions(operation, a, b):
    if operation == ">=":
        return operator.__ge__(a, b)
    if operation == "<=":
        return operator.__le__(a, b)

    if operation == "=":
        return operator.__eq__(a, b)
    if operation == ">":
        return operator.__gt__(a, b)
    if operation == "<":
        return operator.__lt__(a, b)


def filter_rows(obj, filt):
    print operations_to_functions(filt[1], obj.__getattribute__(filt[0]), filt[2])


if __name__ == '__main__':
    pass
